import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({ searchTerm: '' });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/listing/getAllProduct`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setListings(data);
          setShowMore(data.length > 8);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <h1 className='text-2xl font-bold'>Search Listings</h1>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>

        <div className='p-7 flex flex-wrap gap-4 justify-center'>
          {loading && <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>}

          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700 text-center w-full'>No results found</p>
          )}

          {!loading && Array.isArray(listings) &&
            listings.map((listing) => (
              <div key={listing._id} className='border rounded-lg p-4 w-80 shadow-md'>
                <img
                  src={listing.image ? `http://localhost:3000/product_type_images/${listing.image}` : '/placeholder-image.jpg'}
                  className='w-full h-48 object-cover rounded-lg'
                  alt={listing.name || "Property Image"}
                  onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                />

                <h2 className='text-xl font-semibold mt-3'>{listing.name}</h2>
                <p className='text-gray-600 mt-2'>{listing.description}</p>
                <p className='text-gray-800 font-medium mt-2'>Price: Rs:{listing.price}</p>
                <p className='text-gray-800 font-medium mt-2'>Phone: {listing.phone}</p>
              </div>
            ))}

          {showMore && (
            <button className='text-green-700 hover:underline p-7 text-center w-full'>
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
