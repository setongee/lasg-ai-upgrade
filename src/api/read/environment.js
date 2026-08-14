const environment = {
  test: 'http://localhost:8083/api/v2',
  live: 'https://web3.lagosstate.gov.ng/api/v2',
};
const env = environment.test;

const frontend_url_env = {
  test: 'http://localhost:5173',
  live: 'https://lagosstate.gov.ng',
};

const frontend_url = frontend_url_env.test;

export { env, frontend_url };
