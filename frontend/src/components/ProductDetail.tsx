const ProductDetail = () => {
  const handleProductSearch = () => {
    console.log("Product search initiated");
  };

  const productDetail = {
    description: "",
  };

  return (
    <div className="form-section-card product-detail">
      <div className="product-detail-header">
        <h3 className="section-title">Product Detail</h3>
        <button
          type="button"
          className="search-button"
          onClick={handleProductSearch}
        >
          Search
        </button>
      </div>
      {productDetail ? (
        <div className="product-detail-content">
          <div className="product-description">
            <p>{productDetail.description}</p>
          </div>
        </div>
      ) : (
        <p className="no-detail-text">No product detail found.</p>
      )}
    </div>
  );
};

export default ProductDetail;
