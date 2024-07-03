import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import PaymentGatewayHttp from '../../src/infra/gateway/PaymentGatewayHttp';

test.skip('Deve criar uma conta de passageiro', async function () {
  const httpClient = new AxiosAdapter();
  const processPayment = new PaymentGatewayHttp(httpClient);
  const inputPayment = {
    name: '123456789',
    fare: 100
  };
  const outputProcessPayment = await processPayment.process(inputPayment);
  expect(outputProcessPayment.status).toBe('approved');
});
