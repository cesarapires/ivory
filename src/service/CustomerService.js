import axios from 'axios'; 

export default class CustomerService {

    getCustomersSmall() {
        return fetch('data/customers-small.json').then(res => res.json()).then(d => d.data);
    }
  
    getCustomersMedium() {
        return fetch('data/customers-medium.json').then(res => res.json()).then(d => d.data);
    }
  
    getCustomersLarge() {
        return fetch('data/customers-large.json').then(res => res.json()).then(d => d.data);
    }
  
    getCustomersXLarge() {
        return fetch('data/customers-xlarge.json').then(res => res.json()).then(d => d.data);
    }
  
    getCustomers() {
        return axios
		.get('http://127.0.0.1:8000/api/v1/customers')
		.then(response => response).then(d => d.data);
    }
    
}
  