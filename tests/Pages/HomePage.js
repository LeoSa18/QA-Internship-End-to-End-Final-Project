class HomePage{
    constructor(page){
        this.page = page; 
        this.filters = page.locator('#filters');
        this.productCards = page.locator('body > app-root > div > app-overview > div:nth-child(3) > div.col-md-9 > div.container > a:nth-child(1)');
        this.products = page.locator('.card'); //Lista de productos
        this.searchBar = page.locator('#search-query');
        this.paginationControls = page.locator('.pagination');
    }

async searchProduct(query) {
    await this.searchBar.fill(query);
    await this.searchBar.press('Enter');
  }
getAllProducts() {
    return this.products;
  }

getPaginationControls() {
    return this.paginationControls;
  }

getProductContainer() {
    return this.page.locator(
      'body > app-root > div > app-overview > div:nth-child(3) > div.col-md-9 > div.container > div'
    );
  }

async openFirstProduct() {
    const firstProduct = this.productCards.first();
    await firstProduct.click(); 
  }

async openProduct() {
    const firstProduct = this.products.first();
    await firstProduct.click(); // navega a /product/{id}
  }
}

module.exports = {HomePage};