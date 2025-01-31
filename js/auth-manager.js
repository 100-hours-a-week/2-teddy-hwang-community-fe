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

  // 토큰 검증 함수
  validateToken(token) {
    if (!token) return false;

    try {
      // JWT 형식 검증
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Base64URL 디코딩을 위한 패딩 처리
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = payloadBase64.length % 4;
      const paddedPayloadBase64 = pad
        ? payloadBase64 + '='.repeat(4 - pad)
        : payloadBase64;

      // payload 디코딩
      const decodedPayload = atob(paddedPayloadBase64);
      const decoder = new TextDecoder('utf-8');
      const utf8String = decoder.decode(
        new Uint8Array([...decodedPayload].map(char => char.charCodeAt(0))),
      );
      const payload = JSON.parse(utf8String);

      // 필수 클레임 확인
      if (!payload.exp || !payload.iat || !payload.id) {
        return false;
      }

      return payload;
    } catch {
      return false;
    }
  },

  // 개선된 토큰 만료 확인
  isTokenExpired() {
    const token = this.getAccessToken();
    const payload = this.validateToken(token);

    if (!payload) return true;

    try {
      const currentTime = Math.floor(Date.now() / 1000);

      // 토큰 만료 시간과 현재 시간 비교
      if (payload.exp <= currentTime) {
        return true;
      }

      // 토큰 발급 시간 확인 (발급 시간이 미래인 경우 invalid)
      if (payload.iat > currentTime) {
        return true;
      }

      // 토큰의 유효 기간이 너무 긴 경우 체크 (예: 24시간 이상)
      const tokenDuration = payload.exp - payload.iat;
      if (tokenDuration > 24 * 60 * 60) {
        return true;
      }

      return false;
    } catch {
      return true;
    }
  },

  // 토큰 갱신 함수 개선
  async refreshAccessToken() {
    try {
      const response = await fetch(`${address}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 429) {
        return this.getAccessToken();
      }

      if (!response.ok) {
        this.removeAccessToken();
        location.href = '/';
        return null;
      }

      const result = await response.json();
      const newToken = result.data.accessToken;

      // 새로 받은 토큰 검증
      if (!this.validateToken(newToken)) {
        this.removeAccessToken();
        location.href = '/';
        return null;
      }

      this.setAccessToken(newToken);
      return newToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      this.removeAccessToken();
      location.href = '/';
      return null;
    }
  },

  async getAuthHeader() {
    let token = this.getAccessToken();

    if (!token) {
      return {
        Authorization: 'Bearer ',
      };
    }

    if (this.isTokenExpired()) {
      token = await this.refreshAccessToken();
      if (!token) {
        return {
          Authorization: 'Bearer ',
        };
      }
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  },

  getUserInfo() {
    const token = this.getAccessToken();
    return this.validateToken(token);
  },
};

// 홈페이지 리다이렉션 처리
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/') {
    const token = authManager.getAccessToken();
    const isValid = authManager.validateToken(token);
    const isNotExpired = !authManager.isTokenExpired();

    if (token && isValid && isNotExpired) {
      window.location.href = '/posts';
    }
  }
});
