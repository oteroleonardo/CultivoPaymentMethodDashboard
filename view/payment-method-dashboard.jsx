
const [errorMessage, setErrorMessage] = useState('');
import PaymentMethodForm from 'views/payment-method-form';
import { createPaymentMethod, savePaymentMethod, getPaymentMethods} from 'api/services';
import { RetryingDecorator } from 'util/decorator';

const [errorMessage, setErrorMessage] = useState('');
const [paymenthMethodList, setPaymentMethodList] = useState('');
const [paymenthMethod, setPaymentMethod] = useState('');
const [brand, setBrand] = useState('');
const [cardAccountNumber, setCardAccountNumber] = useState('');
const [expiration, setExpiration] = useState('');
const [cvnCode, setCvnCode] = useState('');

const updatePaymenthMethodsSelector = (paymentNethods) => {
  setPaymentMethodList(paymentMethods);
};

const handleSubmit = async () => {
  const {
    error,
    paymentMethodId
  } = await createPaymentMethod(clientId, securityToken, userId, paymenthMethod, brand, cardAccoutNumber, expiration, cvnCode)
  .catch(e => {
    logger.error('Error while creating payment method in payment gateway');
    return { error: { message: 'Payment method was not created. Please try again later or use a different payment method', cause: e.message || 'Unknown' } }
  });
  
  if(error) {
    setErrorMessage(error.message);
    return;
  }
  const paymentMethodName = `${brand} - ${cardAccoutNumber.substr(-4)}`;

  const status = await RetryingDecorator( 3, 'fibonacci', savePaymentMethod(paymentMethodId, paymentMethodName)
  .catch(e => {
    logger.error('Error while saving payment method in Cultivo');
    return { error: { message: 'Payment method was not saved.', cause: e.message || 'Unknown' } }
  }));

  if(status.error){
    // New payment method can not be used 
    setErrorMessage(error.message);
    return;
  }
  
  const paymentMethods = await getPaymentMethods();
  updatePaymenthMethodsSelector(paymentMethods);
}; 
  
export default PaymentMethodDashboard = () => {
  return (
    <container>
    <h2>Payment Method</h2>);
    {errorMessage && (<p className="error"> {errorMessage} </p>)
    }
    <PaymentMethodForm></PaymentMethodForm>
  </container>
}