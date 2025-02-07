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
}
