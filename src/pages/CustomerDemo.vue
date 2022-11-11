<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
							<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCustomers || !selectedCustomers.length" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="customers" v-model:selection="selectedCustomers" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Customers</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="code" header="Code" :sortable="true" headerStyle="width:5%; min-width:5rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.id}}
						</template>
					</Column>
					<Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.name}}
						</template>
					</Column>
					<Column field="category" header="Birthdate" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Birthdate</span>
							{{slotProps.data.birthdate}}
						</template>
					</Column>
					<Column field="price" header="CPF" :sortable="true" headerStyle="width:14%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">CPF</span>
							{{slotProps.data.cpf}}
						</template>
					</Column>
					<Column field="rating" header="Total Purchase" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template>
							<span class="p-column-title">Total Purchase</span>
							
						</template>
					</Column>
					<Column field="inventoryStatus" header="Last Purchase" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template>
							<span class="p-column-title">Last Purchase</span>
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCustomer(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteCustomer(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="customerDialog" :style="{width: '50%'}" header="Customer Details" :modal="true" class="p-fluid">
					<div class="formgrid grid">
						<div class="field col">
							<label for="name">Name</label>
							<InputText id="name" v-model.trim="customer.name" required="true" autofocus :class="{'p-invalid': submitted && !customer.name}" />
							<small class="p-invalid" v-if="submitted && !customer.name">Name is required.</small>
						</div>
						<div class="field col">
							<label for="birthdate">BirthDate</label>
							<Calendar id="birthdate" v-model="customer.birthdate"/>
						</div>
					</div>
					<div class="formgrid grid">
						<div class="field col">
							<label for="price">CPF</label>
							<InputMask  id="price" v-model="customer.cpf" mask="999.999.999-99" />
						</div>
						<div class="field col">
							<label for="quantity">RG</label>
							<InputText id="quantity" v-model="customer.rg"/>
						</div>
					</div>
					<div class="formgrid grid">
						<div class="field col">
							<label for="price">Cell phone</label>
							<InputMask id="price" v-model="customer.cellphone" mask="(99) 99999-9999" />
						</div>
						<div class="field col">
							<label for="quantity">Tell phone</label>
							<InputMask id="quantity" v-model="customer.telephone" mask="(99) 9999-9999"/>
						</div>
					</div>

					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCustomer" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteCustomerDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="customer">Are you sure you want to delete <b>{{customer.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCustomerDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCustomer" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteCustomersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="customer">Are you sure you want to delete the selected customers?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCustomersDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteselectedCustomers" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import CustomerService from '../service/CustomerService';

export default {
	data() {
		return {
			customers: null,
			customerDialog: false,
			deleteCustomerDialog: false,
			deleteCustomersDialog: false,
			customer: {},
			selectedCustomers: null,
			filters: {},
			submitted: false,
			statuses: [
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			]
		}
	},
	CustomerService: null,
	created() {
		this.customerService = new CustomerService();
		this.initFilters();
	},
	mounted() {
		this.customerService.getCustomers().then(data => this.customers = data);
	},
	methods: {
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.customer = {};
			this.submitted = false;
			this.customerDialog = true;
		},
		hideDialog() {
			this.customerDialog = false;
			this.submitted = false;
		},
		saveCustomer() {
			this.submitted = true;
			if (this.customer.name.trim()) {
				if (this.customer.id) {
					this.customers[this.findIndexById(this.customer.id)] = this.customer;
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Customer Updated', life: 3000});
				}
				else {
					this.customer.id = this.createId();
					this.customer.code = this.createId();
					this.customer.image = 'customer-placeholder.svg';
					this.customer.inventoryStatus = this.customer.inventoryStatus ? this.customer.inventoryStatus.value : 'INSTOCK';
					this.customers.push(this.customer);
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Customer Created', life: 3000});
				}
				this.customerDialog = false;
				this.customer = {};
			}
		},
		editCustomer(customer) {
			this.customer = {...customer};
			this.customerDialog = true;
		},
		confirmDeleteCustomer(customer) {
			this.customer = customer;
			this.deleteCustomerDialog = true;
		},
		deleteCustomer() {
			this.customers = this.customers.filter(val => val.id !== this.customer.id);
			this.deleteCustomerDialog = false;
			this.customer = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.customer.length; i++) {
				if (this.customer[i].id === id) {
					return index;
				}
			}
			return index;
		},
		createId() {
			return  this.customers.length +1;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteCustomersDialog = true;
		},
		deleteselectedCustomers() {
			this.customers = this.customers.filter(val => !this.selectedCustomers.includes(val));
			this.deleteCustomersDialog = false;
			this.selectedCustomers = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000});
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        }
	}
}
</script>

<style scoped lang="scss">
@import '../assets/demo/badges.scss';
</style>
