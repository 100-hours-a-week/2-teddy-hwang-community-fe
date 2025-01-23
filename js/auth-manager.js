const authManager = {
    setAccessToken(token) {
        localStorage.setItem('accessToken', token);
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    removeAccessToken() {
        localStorage.removeItem('accessToken');
    },
    // Access Token 만료 확인 추가
    isTokenExpired() {
        const token = this.getAccessToken();
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            return Date.now() >= expirationTime;
        } catch {
            return true;
        }
    },

    // 토큰 갱신 함수 추가
    async refreshAccessToken() {
        try {
            const response = await fetch(`${address}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });
            
            // 429 에러 처리
            if(response.status === 429) {
                return this.getAccessToken();
            }

            if (!response.ok) {
                this.removeAccessToken();
                location.href = '/';
                return null;
            }

            const result = await response.json();
            this.setAccessToken(result.data.accessToken);
            return result.data.accessToken;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            this.removeAccessToken();
            location.href = '/';
            return null;
        }
    },

    // API 요청용 헤더 가져오기 수정
    async getAuthHeader() {
        let token = this.getAccessToken();

        if(!token) {
            return {
                'Authorization': `Bearer `
            }
        }

        // 토큰이 만료되었으면 갱신
        if (this.isTokenExpired()) {
            token = await this.refreshAccessToken();
            if(!token) {
                return {
                    'Authorization': `Bearer `
                }
            }
        }

        return {
            'Authorization': `Bearer ${token}`
        };
    },
    getUserInfo() {
        const token = this.getAccessToken();
        // 1. 토큰 존재 확인
        if (!token) {
            return null;
        }

        try {
            // JWT 형식 검증
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            // Base64URL 디코딩을 위한 패딩 처리
            const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const pad = payloadBase64.length % 4;
            const paddedPayloadBase64 = pad ? payloadBase64 + '='.repeat(4 - pad) : payloadBase64;

            const decodedPayload = atob(paddedPayloadBase64);
            const decoder = new TextDecoder('utf-8');
            const utf8String = decoder.decode(
                new Uint8Array([...decodedPayload].map(char => char.charCodeAt(0)))
            );

            return JSON.parse(utf8String);
        } catch (error) {
            console.error('JWT 디코딩 실패:', error);
            return null;
        }
    }
};