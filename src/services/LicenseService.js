export const LicenseService = {
  async getListOfLicenses() {
    const url = 'http://localhost:8080/license/list?page=0&perPage=20'
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('Log the fetched data:', data) // Log the fetched data
      return data
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }
  },

  async createOrEditLicense(license, licenses, toast, findIndexById) {
    // Check if the license name is not empty
    if (license?.name?.trim()) {
      // Format the expiry date to ISO string if it exists
      if (license.expiryDate) {
        license.expiryDate = new Date(license.expiryDate).toISOString().split('T')[0]
      }

      // Create the payload with the license data
      const payload = {
        license: { ...license },
      }

      try {
        // Send the license data to the server
        const response = await fetch('http://localhost:8080/license/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        // Check if the response is not ok, then throw an error
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Parse the license id
        const id = await response.json()
        console.log('License ID was saved successfully:', id)

        // Fetch the updated license data from the server using the generated ID
        const updatedLicenseResponse = await fetch(`http://localhost:8080/license/${id}`)
        if (!updatedLicenseResponse.ok) {
          throw new Error('Failed to fetch updated license data')
        }

        // Parse the updated license data
        const updatedLicenseData = await updatedLicenseResponse.json()
        console.log('Updated license data:', updatedLicenseData)

        // Update the licenses array with the fetched data
        if (license.id) {
          licenses[findIndexById(license.id)] = updatedLicenseData
          // Show a success toast message
          toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'License Updated',
            life: 3000,
          })
        } else {
          licenses.push(updatedLicenseData)
          // Show a success toast message
          toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'License Created',
            life: 3000,
          })
        }
      } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error('There was a problem with the fetch operation:', error)
      }

      // Close the license dialog and reset the license object
      return { licenseDialog: false, license: {} }
    }
  },
}

// Export createOrEditLicense separately
export const createOrEditLicense = LicenseService.createOrEditLicense
