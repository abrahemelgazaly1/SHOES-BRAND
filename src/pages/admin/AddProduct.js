import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../config/api';

const AddProduct = ({ editProduct = null, onSave = null }) => {
  const categories = ['Shoes', 'Accessories'];

  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
  
  const colors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Black', 
    'White', 'Purple', 'Pink', 'Orange', 'Brown',
    'Gray', 'Navy', 'Beige', 'Maroon', 'Turquoise',
    'White and Black'
  ];

  const [formData, setFormData] = useState(editProduct ? {
    ...editProduct,
    fakePrice: editProduct.fakePrice || ''
  } : {
    name: '',
    price: '',
    fakePrice: '',
    description: '',
    category: '',
    sizes: [],
    colors: [],
    images: [],
    soldOutSizes: [],
    soldOutColors: []
  });

  const [uploading, setUploading] = useState(false);

  // Compress image before upload
  const compressImage = (file, maxWidth = 800, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 4 images for Shoes, 1 for Accessories
    const maxImages = formData.category === 'Shoes' ? 4 : 1;
    const remainingSlots = maxImages - formData.images.length;
    
    if (files.length > remainingSlots) {
      Swal.fire({
        icon: 'warning',
        title: 'Too Many Images',
        text: `You can only upload ${maxImages} image${maxImages > 1 ? 's' : ''} for ${formData.category}. ${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} remaining.`,
        confirmButtonColor: '#000'
      });
      return;
    }
    
    setUploading(true);

    try {
      const base64Images = [];
      
      for (const file of files) {
        // Compress and convert image to Base64
        const compressed = await compressImage(file);
        base64Images.push(compressed);
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`,
        confirmButtonColor: '#000',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to upload images',
        confirmButtonColor: '#000'
      });
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editProduct) {
        await axios.put(`${API_URL}/api/products/${editProduct._id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Product updated successfully',
          confirmButtonColor: '#000',
          timer: 2000
        });
        if (onSave) onSave();
      } else {
        await axios.post(`${API_URL}/api/products`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Product added successfully',
          confirmButtonColor: '#000',
          timer: 2000
        });
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          sizes: [],
          images: [],
          soldOutSizes: []
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save product',
        confirmButtonColor: '#000'
      });
    }
  };

  const toggleSelection = (field, value) => {
    setFormData(prev => {
      const array = prev[field];
      const index = array.indexOf(value);
      if (index > -1) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Price (EGP)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Fake Price (EGP) - Optional</label>
          <input
            type="number"
            value={formData.fakePrice}
            onChange={(e) => setFormData({ ...formData, fakePrice: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
            placeholder="Original price (will be shown as crossed out)"
          />
          <p className="text-sm text-gray-500 mt-1">This price will appear crossed out next to the real price</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => {
              const newCategory = e.target.value;
              setFormData({ 
                ...formData, 
                category: newCategory,
                sizes: [],
                colors: [],
                soldOutSizes: [],
                soldOutColors: [],
                images: []
              });
            }}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black"
            required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sizes - Only for Shoes */}
        {formData.category === 'Shoes' && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {shoeSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSelection('sizes', size)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    (formData.sizes || []).includes(size)
                      ? 'bg-[#02173A] text-white'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors - Only for Shoes */}
        {formData.category === 'Shoes' && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleSelection('colors', color)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    (formData.colors || []).includes(color)
                      ? 'bg-[#02173A] text-white'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}>
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sold Out Sizes - Only for Shoes when editing */}
        {editProduct && formData.category === 'Shoes' && formData.sizes?.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="block font-semibold mb-2 text-red-800">Sold Out Sizes</label>
            <p className="text-sm text-gray-600 mb-2">Select sizes that are sold out:</p>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSelection('soldOutSizes', size)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    (formData.soldOutSizes || []).includes(size)
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sold Out Colors - Only for Shoes when editing */}
        {editProduct && formData.category === 'Shoes' && formData.colors?.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="block font-semibold mb-2 text-red-800">Sold Out Colors</label>
            <p className="text-sm text-gray-600 mb-2">Select colors that are sold out:</p>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleSelection('soldOutColors', color)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    (formData.soldOutColors || []).includes(color)
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}>
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Images {formData.category && `(Max ${formData.category === 'Shoes' ? '4' : '1'} image${formData.category === 'Shoes' ? 's' : ''})`}
          </label>
          <input
            type="file"
            multiple={formData.category === 'Shoes'}
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!formData.category || (formData.category === 'Shoes' && formData.images.length >= 4) || (formData.category === 'Accessories' && formData.images.length >= 1)}
            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {!formData.category && <p className="text-gray-500 text-sm mt-1">Please select a category first</p>}
          {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}
          {formData.images.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 font-bold text-sm">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-[#02173A] text-white py-3 rounded-lg font-bold hover:bg-[#031e47] transition disabled:bg-gray-400">
          {editProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
