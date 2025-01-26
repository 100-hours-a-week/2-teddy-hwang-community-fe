// API 호출 공통 핸들러
const handleApiRequest = async (requestFunc, isPublic = false) => {
    try {
        const response = await requestFunc();
        
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const resetTime = parseInt(retryAfter);
            alert(`요청이 너무 많습니다. ${resetTime}초 후에 다시 시도해주세요.`);
            return { error: '429', response };
        }

        if (!isPublic && response.status === 401) {
            alert('로그인이 필요한 서비스입니다.');
            location.href = '/';
            return { error: '401', response };
        }

        return { data: await response.json(), response };
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
};

const apiGet = async (url) => {
    const headers = await authManager.getAuthHeader();
    const response = await handleApiRequest(() => fetch(url, {
        headers,
        credentials: 'include'
    }));
    return { data: response.data, response };
};

const apiGetNoHeader = async (url) => {
    const response = await handleApiRequest(() => fetch(url), true);
    return { data: response.data, response };
};

const apiPost = async (url, body) => {
    const headers = await authManager.getAuthHeader();
    headers['Content-Type'] = 'application/json';
    return handleApiRequest(() => fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body
    }));
};

const apiPatch = async (url, body) => {
    const headers = await authManager.getAuthHeader();
    headers['Content-Type'] = 'application/json';
    return handleApiRequest(() => fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body
    }));
};

const apiDelete = async (url) => {
    const headers = await authManager.getAuthHeader();
    return handleApiRequest(() => fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include'
    }));
};

const apiPostFormData = async (url, formData) => {
    const headers = await authManager.getAuthHeader();
    return handleApiRequest(() => fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
    }));
};
const apiPostFormDataNoHeader = async (url, formData) => {
    return handleApiRequest(() => fetch(url, {
        method: 'POST',
        body: formData
    }), true);
};

const apiPatchFormData = async (url, formData) => {
    const headers = await authManager.getAuthHeader();
    return handleApiRequest(() => fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: formData
    }));
};