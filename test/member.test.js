const axios = require('axios');
// const member = require('../model/member');

const apiUrl = 'http://localhost:8080';


describe('api test', () => {
    it('회원가입 테스트',  async () => {

        const member = {
            username : "test123",
            pw : "1234",
            nickName : "Jset tester",
        };

        try {
            const response = await axios.post(`${apiUrl}/signup`, member);
            expect(response.status).toBe(200);
            expect(response.data).toEqual({message : 'signup success!'})
        }catch (error) {
            console.error('api 호출 중 오류 발생', error);
            throw error;
        }
    });
});