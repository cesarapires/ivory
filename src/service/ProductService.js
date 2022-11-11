import axios from 'axios'; 
export default class ProductService {


    getProductsSmall() {
		return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
	}

	getProducts() {
		return axios
		.get('http://127.0.0.1:8000/api/v1/customers')
		.then(response => response).then(d => d.data);
		// return fetch('data/products.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
		return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
	}
	
}