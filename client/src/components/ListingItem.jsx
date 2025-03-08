
export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <div key={listing._id} className='border rounded-lg p-4 w-80 shadow-md'>
        <img
          src={listing.image ? `http://10.0.2.2:3000/product_type_images/${listing.image}` : 'https://via.placeholder.com/150'}
          className='w-full h-48 object-cover rounded-lg'
          alt={listing.name || "Property Image"}
        />
        <h2 className='text-xl font-semibold mt-3'>{listing.name}</h2>
        <p className='text-gray-600 mt-2'>{listing.description}</p>
        <p className='text-gray-800 font-medium mt-2'>Price: Rs:{listing.price}</p>
        <p className='text-gray-800 font-medium mt-2'>Phone: {listing.phone}</p>
      </div>
    </div>
  );
}
