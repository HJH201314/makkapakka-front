// test.ts
import { MockMethod, MockConfig } from 'vite-plugin-mock';

export default function (config: MockConfig) {
  return [
    {
      url: '/api/test',
      method: 'get',
      rawResponse: async (req, res) => {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            code: 1,
            message: 'ok',
            data: '',
          })
        );
      },
    },
  ];
}
