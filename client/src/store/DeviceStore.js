import { makeAutoObservable } from "mobx";

class DeviceStore {
    constructor() {
        this._types = [];
        this._brands = [];
        this._devices = [];
        this._selectedType = {};
        this._selectedBrand = {};
        this._page = 1;
        this._totalCount = 0;
        this._limit = 3;
        this._searchTerm = ''; // Add searchTerm state
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }
    setBrands(brands) {
        this._brands = brands;
    }
    setDevices(devices) {
        this._devices = devices;
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedBrand(brand) {
        this.setPage(1)
        this._selectedBrand = brand
    }

    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    setSearchTerm(term) {  // Add setSearchTerm action
        this._searchTerm = term;
        this.setPage(1); // Reset page when search term changes
    }

    resetFilters() {
        this._selectedType = {};
        this._selectedBrand = {};
        this._page = 1;
        this._searchTerm = '';
    }

    get types() {
        return this._types;
    }
    get brands() {
        return this._brands;
    }
    get devices() {
        let filteredDevices = this._devices;

        if (this._selectedType.id) {
            filteredDevices = filteredDevices.filter(device => device.typeId === this._selectedType.id)
        }
        if (this._selectedBrand.id) {
            filteredDevices = filteredDevices.filter(device => device.brandId === this._selectedBrand.id)
        }

        if (this._searchTerm) {
            filteredDevices = filteredDevices.filter(device =>
                device.name.toLowerCase().includes(this._searchTerm.toLowerCase())
            );
        }

        return filteredDevices;
    }

    get selectedType() {
        return this._selectedType
    }
    get selectedBrand() {
        return this._selectedBrand
    }

    get page() {
        return this._page
    }
    get totalCount() {
        return this._totalCount
    }
    get limit() {
        return this._limit
    }

    get searchTerm() {
        return this._searchTerm;
    }

}

export default DeviceStore;
