import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import placeholderImage from '../assets/home_page.jpg';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`http://localhost:3000/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    setSidebardata((prev) => ({
      ...prev,
      [id]: id === 'searchTerm' ? value : checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleEdit = (id, field, value) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing._id === id ? { ...listing, [field]: value } : listing
      )
    );
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>

        <div className='p-7 flex flex-wrap gap-4 justify-center'>
          {loading && <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>}

          {!loading && listings.length === 0 && (
            <img src={placeholderImage} className='w-80 h-80 object-cover rounded-lg' alt="No results found" />
          )}

          {!loading &&
            listings.map((listing) => (
              <div key={listing._id} className='border rounded-lg p-4 w-80 shadow-md'>
                <img
                  src={listing.image || placeholderImage}
                  className='w-full h-48 object-cover rounded-lg'
                  alt={listing.name || "Property Image"}
                />
                <input
                  type='text'
                  className='w-full mt-3 text-xl font-semibold border-b p-1'
                  value={listing.name || ""}
                  placeholder="Enter property name"
                  onChange={(e) => handleEdit(listing._id, "name", e.target.value)}
                />
                <textarea
                  className='w-full text-gray-600 mt-2 border rounded p-2'
                  value={listing.description || ""}
                  placeholder="Enter description"
                  onChange={(e) => handleEdit(listing._id, "description", e.target.value)}
                />
                <input
                  type='text'
                  className='w-full text-gray-800 font-medium mt-2 border-b p-1'
                  value={listing.address || ""}
                  placeholder="Enter address"
                  onChange={(e) => handleEdit(listing._id, "address", e.target.value)}
                />
              </div>
            ))}

          {showMore && (
            <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
