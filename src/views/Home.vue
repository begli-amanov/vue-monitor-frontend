<script setup>
// Import necessary modules and components
import { LicenseService } from '@/services/LicenseService'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

// Import PrimeVue components
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'

// Fetch licenses when the component is mounted
onMounted(async () => {
  try {
    const data = await LicenseService.getListOfLicenses()
    licenses.value = data.licenses
  } catch (error) {
    console.error('Failed to fetch licenses:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch licenses',
    })
  }
})

// References to various reactive variables
const dt = ref()
const licenses = ref([])
const license = ref({})
const toast = useToast()
const submitted = ref(false)
const selectedLicenses = ref()
const licenseDialog = ref(false)
const deleteLicenseDialog = ref(false)
const deleteLicensesDialog = ref(false)

// Filters for the search bar
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

// Status options for the dropdown
const statuses = ref([
  { label: 'VALID', value: 'VALID' },
  { label: 'EXPIRING SOON', value: 'EXPIRING SOON' },
  { label: 'EXPIRED', value: 'EXPIRED' },
])

// Vendor options for the dropdown
const vendors = ref([
  { label: 'DVEAS', value: 'DVEAS' },
  { label: 'SIDEFX', value: 'SIDEFX' },
  { label: 'FOUNDRY', value: 'FOUNDRY' },
])

// Manufacturer options for the dropdown
const manufacturers = ref([
  { label: 'AUTODESK', value: 'AUTODESK' },
  { label: 'SIDEFX', value: 'SIDEFX' },
  { label: 'FOUNDRY', value: 'FOUNDRY' },
])

// Function to format currency values to Euro
const formatCurrency = (value) => {
  if (value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
    })
  }
  return ''
}

// Function to clear the search input
const clearInput = () => {
  filters.value.global.value = null
  document.getElementById('search-field').value = ''
}

// Function to open the dialog for creating a new license
const openNew = () => {
  license.value = {}
  submitted.value = false
  licenseDialog.value = true
}

// Function to hide the dialog
const hideDialog = () => {
  licenseDialog.value = false
  submitted.value = false
}

// Function to save the license
const saveLicense = async () => {
  // Mark the form as submitted
  submitted.value = true

  // Check if the license name is not empty
  if (license?.value.name?.trim()) {
    // Format the expiryDate to 'yyyy-mm-dd' if it exists
    if (license.value.expiryDate) {
      license.value.expiryDate = new Date(license.value.expiryDate).toISOString().split('T')[0]
    }
    // Check if the license has an ID (existing license)
    if (license.value.id) {
      // Update the status if it has a value property
      license.value.status = license.value.status.value
        ? license.value.status.value
        : license.value.status
      // Update the license in the licenses array
      licenses.value[findIndexById(license.value.id)] = license.value
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'License Updated',
        life: 3000,
      })
      console.log('License updated:', license.value)
    } else {
      // Set the status to 'VALID' if not already set
      license.value.status = license.value.status ? license.value.status.value : 'VALID'
      // Add the new license to the licenses array
      licenses.value.push(license.value)
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'License Created',
        life: 3000,
      })
      console.log('License created:', license.value)
    }
    // Prepare the data to be sent to the server
    const payload = {
      license: { ...license.value, totalPrice: totalPrice.value },
    }
    // Log the object being sent to the server
    console.log('Object being sent:', payload)

    try {
      // Send the license data to the server
      const response = await fetch('http://localhost:8080/license/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      // Check if the response is not ok
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Parse the response data
      const data = await response.json()
      console.log('License saved successfully:', data)
    } catch (error) {
      // Log any errors that occur during the fetch operation
      console.error('There was a problem with the fetch operation:', error)
    }
    // Close the license dialog and reset the license object
    licenseDialog.value = false
    license.value = {}
  }
}

// Function to edit a license
const editLicense = (licenseData) => {
  license.value = { ...licenseData }
  licenseDialog.value = true
}

// Function to confirm deletion of a single license
const confirmDeleteLicense = (licenseData) => {
  license.value = licenseData
  deleteLicenseDialog.value = true
}

// Function to delete a single license
const deleteLicense = async () => {
  try {
    // Send a DELETE request to the endpoint with the license ID
    const response = await fetch(`http://localhost:8080/license/delete/${license.value.id}`, {
      method: 'DELETE',
    })
    // Check if the response is not ok, then throw an error
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    // Filter out the deleted license from the licenses array
    licenses.value = licenses.value.filter((val) => val.id !== license.value.id)
    // Close the delete license dialog
    deleteLicenseDialog.value = false
    // Reset the license object
    license.value = {}
    // Show a success toast message
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'License Deleted',
      life: 3000,
    })
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error('There was a problem with the fetch operation:', error)
  }
}

// Function to find the index of a license by its ID
const findIndexById = (id) => {
  let index = -1
  for (let i = 0; i < licenses.value.length; i++) {
    if (licenses.value[i].id === id) {
      index = i
      break
    }
  }
  return index
}

// Function to confirm deletion of selected licenses
const confirmDeleteSelected = () => {
  // Open the delete licenses confirmation dialog
  deleteLicensesDialog.value = true
}

// Function to delete selected licenses
const deleteSelectedLicenses = async () => {
  try {
    // Get the IDs of the selected licenses
    const licenseIds = selectedLicenses.value.map((license) => license.id)

    // Log the request details for debugging
    console.log('Request URL: http://localhost:8080/license/delete')
    console.log('Request Method: DELETE')
    console.log('Request Body:', JSON.stringify({ ids: licenseIds }))

    // Send a DELETE request to the endpoint with the selected license IDs
    const response = await fetch('http://localhost:8080/license/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: licenseIds }),
    })

    // Check if the response is not ok, then throw an error
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Filter out the deleted licenses from the licenses array
    licenses.value = licenses.value.filter((val) => !licenseIds.includes(val.id))

    // Close the delete licenses dialog
    deleteLicensesDialog.value = false

    // Reset the selected licenses
    selectedLicenses.value = null

    // Show a success toast message
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Licenses Deleted',
      life: 3000,
    })
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error('There was a problem with the fetch operation:', error)
  }
}

// Function to get the status label for a license
const getStatusLabel = (status) => {
  switch (status) {
    case 'VALID':
      return 'success'

    case 'EXPIRING SOON':
      return 'warn'

    case 'EXPIRED':
      return 'danger'

    default:
      return null
  }
}
</script>

<template>
  <!-- Reference cards start here -->
  <div class="bg-surface-950 px-4 pt-6">
    <div class="grid grid-cols-12 gap-4">
      <!-- Charts card-->
      <RouterLink to="/charts" class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-surface-900 shadow p-4 rounded-border card-border">
          <div class="flex justify-between mb-4">
            <div>
              <div class="text-surface-0 font-medium !text-xl">Charts</div>
            </div>
            <div class="flex items-center justify-center bg-blue-100 rounded-border w-10 h-10">
              <i class="pi pi-chart-bar text-blue-600 !text-xl" />
            </div>
          </div>
          <span class="text-green-500 font-medium">Quarter - Month</span>
        </div>
      </RouterLink>

      <!-- Expires next card -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-surface-900 shadow p-4 rounded-border card-border">
          <div class="flex justify-between mb-4">
            <div>
              <div class="text-surface-0 font-medium !text-xl">Expires next</div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 rounded-border w-10 h-10">
              <i class="pi pi-clock text-orange-600 !text-xl" />
            </div>
          </div>
          <span class="text-green-500 font-medium">23-03-2023 </span>
          <span class="text-surface-400">PR3183421</span>
        </div>
      </div>

      <!-- Value card -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-surface-900 shadow p-4 rounded-border card-border">
          <div class="flex justify-between mb-4">
            <div>
              <div class="text-surface-0 font-medium !text-xl">Value</div>
            </div>
            <div class="w-10 h-10 flex items-center justify-center bg-cyan-100 rounded-border">
              <i class="pi pi-cart-plus text-cyan-600 !text-xl" />
            </div>
          </div>
          <span class="text-green-500 font-medium">52000$ </span>
        </div>
      </div>

      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-surface-900 shadow p-4 rounded-border card-border">
          <div class="flex justify-between mb-4">
            <div>
              <div class="text-surface-0 font-medium !text-xl">Recent Purchase</div>
            </div>
            <div class="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-border">
              <i class="pi pi-wallet text-purple-600 !text-xl" />
            </div>
          </div>
          <span class="text-green-500 font-medium">PR3183432 </span>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-surface-950 p-4">
    <!-- Toolbar starts here -->
    <Toolbar class="mb-4">
      <template #start>
        <Button label="New" icon="pi pi-pen-to-square" class="mr-2" @click="openNew" />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="confirmDeleteSelected"
          :disabled="!selectedLicenses || !selectedLicenses.length"
        />
      </template>

      <template #end>
        <FileUpload
          mode="basic"
          accept="csv/*"
          :maxFileSize="1000000"
          label="Import"
          customUpload
          chooseLabel="Import"
          class="mr-2"
          auto
          :chooseButtonProps="{ severity: 'primary' }"
        />
        <!-- Signout button. a better place for this button? -->
        <RouterLink to="/login">
          <Button label="Out" icon="pi pi-power-off" severity="danger" />
        </RouterLink>
      </template>
    </Toolbar>

    <!-- Here begins data table itself -->
    <DataTable
      :rows="10"
      :value="licenses"
      :filters="filters"
      :rowsPerPageOptions="[5, 10, 25]"
      paginator
      ref="dt"
      dataKey="id"
      removableSort
      showGridlines
      resizableColumns
      columnResizeMode="fit"
      v-model:selection="selectedLicenses"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    >
      <!-- Search input -->
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-center">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>

            <InputText
              v-model="filters['global'].value"
              placeholder="Search..."
              id="search-field"
            />

            <!-- Clear icon as svg -->
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="p-icon p-select-clear-icon"
              aria-hidden="true"
              v-if="filters['global'].value"
              @click="clearInput"
            >
              <path
                d="M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z"
                fill="currentColor"
              ></path>
            </svg>
          </IconField>
        </div>
      </template>

      <!-- No matching results message -->
      <template #empty> No licenses found. </template>
      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

      <!-- Name column -->
      <Column field="name" header="Name" style="min-width: 14rem" sortable></Column>

      <!-- PO column -->
      <Column field="po" header="PO" style="min-width: 8rem" sortable></Column>

      <!-- WBS column -->
      <Column field="wbs" header="WBS" style="min-width: 10rem" sortable></Column>

      <!-- Quantity column -->
      <Column field="quantity" header="Quantity" style="min-width: 8rem" sortable></Column>

      <!-- Total price column -->
      <Column field="price" header="Total Price" style="min-width: 8rem" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.totalPrice) }}
        </template>
      </Column>

      <!-- Expiry column -->
      <Column field="expiryDate" header="Expiry Date" sortable style="min-width: 8rem"></Column>

      <!-- Status column -->
      <Column field="status" header="Status" style="min-width: 10rem" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
        </template>
      </Column>

      <!-- Vendor column -->
      <Column field="vendor" header="Vendor" sortable style="min-width: 10rem"></Column>

      <!-- Actions column -->
      <Column :exportable="false" header="Actions" style="width: 1rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            severity="success"
            class="mr-2"
            @click="editLicense(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            severity="danger"
            @click="confirmDeleteLicense(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
    <Toast />
  </div>

  <!-- Modal dialog for edition and creation of a new license -->
  <Dialog
    v-model:visible="licenseDialog"
    :style="{ width: '450px' }"
    header="License Details"
    :modal="true"
  >
    <div class="flex flex-col gap-4">
      <!-- Name input on modal -->
      <div>
        <label for="name" class="block font-bold mb-3">Name</label>
        <InputText
          id="name"
          v-model.trim="license.name"
          required="true"
          autofocus
          :invalid="submitted && !license.name"
          fluid
        />
        <small v-if="submitted && !license.name" class="text-red-500">Name is required.</small>
      </div>

      <!-- PO on modal -->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="po" class="block font-bold mb-3">PO</label>
          <InputText id="po" v-model="license.po" fluid />
        </div>

        <!-- WBS on modal -->
        <div class="col-span-6">
          <label for="wbs" class="block font-bold mb-3">WBS</label>
          <InputText id="wbs" v-model="license.wbs" fluid />
        </div>
      </div>

      <!-- License status selects on modal -->
      <!-- <div>
				<label for="status" class="block font-bold mb-3">License Status</label>

				<Select
					id="status"
					v-model="license.status"
					:options="statuses"
					optionLabel="label"
					placeholder="Select a Status"
					fluid
				></Select>
			</div> -->

      <!-- Vendor select on modal-->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="vendor" class="block font-bold mb-3">Vendor</label>
          <Select
            id="vendor"
            v-model="license.vendor"
            :options="vendors"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Vendor"
            fluid
          ></Select>
        </div>

        <!-- Vendor select on modal -->
        <div class="col-span-6">
          <label for="manufacturer" class="block font-bold mb-3">Manufacturer</label>
          <Select
            id="manufacturer"
            v-model="license.manufacturer"
            :options="manufacturers"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Manufacturer"
            fluid
          ></Select>
        </div>
      </div>

      <!-- Date picker -->
      <div class="flex-auto">
        <label class="font-bold block mb-2"> Expiry Date </label>
        <DatePicker
          v-model="license.expiryDate"
          showIcon
          fluid
          iconDisplay="input"
          inputId="license.expiryDate"
          dateFormat="yy-mm-dd"
        />
      </div>

      <!-- Unit price on modal -->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="unitPrice" class="block font-bold mb-3">Unit Price</label>
          <InputNumber
            id="unitPrice"
            v-model="license.unitPrice"
            mode="currency"
            currency="EUR"
            locale="en-US"
            fluid
          />
        </div>

        <!-- Quantity on modal -->
        <div class="col-span-6">
          <label for="quantity" class="block font-bold mb-3">Quantity</label>
          <InputNumber id="quantity" v-model="license.quantity" integeronly fluid />
        </div>
      </div>

      <!-- Total price of a license -->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <label for="totalPrice" class="block font-bold mb-3">Total Price</label>
          <InputNumber
            id="totalPrice"
            mode="currency"
            currency="EUR"
            v-model="license.totalPrice"
            integeronly
            fluid
          />
        </div>
      </div>

      <!-- Notes on modal -->
      <div>
        <label for="note" class="block font-bold mb-3">Notes</label>
        <Textarea id="note" v-model="license.note" required="true" rows="3" cols="20" fluid />
      </div>
    </div>

    <!-- Cancel button on modal -->
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        @click="hideDialog"
        class="modal-dialog-btn mt-5"
      />

      <!-- Save button on modal -->
      <Button label="Save" icon="pi pi-save" @click="saveLicense" class="modal-dialog-btn mt-5" />
    </template>
  </Dialog>

  <!-- Single license deletion modal dialog -->
  <Dialog
    v-model:visible="deleteLicenseDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="license"
        >Are you sure you want to delete <b>{{ license.name }}</b
        >?</span
      >
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        @click="deleteLicenseDialog = false"
        class="modal-dialog-btn"
      />

      <Button label="Yes" icon="pi pi-check" @click="deleteLicense" class="modal-dialog-btn" />
    </template>
  </Dialog>

  <!-- Multiple licenses deletion modal dialog -->
  <Dialog
    v-model:visible="deleteLicensesDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="license">Are you sure you want to delete the selected licenses?</span>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        @click="deleteLicensesDialog = false"
        class="modal-dialog-btn"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        @click="deleteSelectedLicenses"
        class="modal-dialog-btn"
      />
    </template>
  </Dialog>
</template>
