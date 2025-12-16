import HomePageClient from '../HomePageClient';

export default function Home() {
  return (
    <>
      {/* SEO Content - Visible to Google Crawler (Server-Side Rendered) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h1>AqaarGate - #1 Real Estate Platform in Syria & Lattakia | Buy, Rent & Sell Properties</h1>
        <p>
          AqaarGate is the leading real estate platform in Syria and Lattakia. Find 1000+ verified properties for sale and rent. 
          Discover luxury homes, apartments, holiday homes (بيوت عطلات سوريا), villas, and commercial properties. 
          Trusted by expats from Germany, Netherlands, EU, UAE, Saudi Arabia, Qatar, Kuwait. 
          Expert guidance for international property buyers. Start your property search today!
        </p>
        <h2>Real Estate Properties in Syria</h2>
        <p>
          Discover the best real estate properties in Syria with AqaarGate. We offer a wide selection of properties for sale and rent in Syria, 
          including luxury homes, apartments, holiday homes, and commercial properties. Whether you're looking for syria apartments, 
          syria houses, or syria villas, we have the perfect property for you.
        </p>
        <h2>Lattakia Real Estate & Properties</h2>
        <p>
          Explore Lattakia properties and Lattakia real estate with AqaarGate. Our collection includes Lattakia apartments, 
          Lattakia houses, Lattakia villas, and Lattakia beach properties. Find your dream home in one of Syria's most beautiful coastal cities.
        </p>
        <h2>Holiday Homes & Vacation Rentals in Syria</h2>
        <p>
          Looking for holiday homes in Syria or vacation rentals? AqaarGate offers premium syria holiday homes and 
          lattakia holiday homes for rent. Perfect for families and expats looking for syria vacation rentals or 
          lattakia vacation rentals. Experience the beauty of Syria with our carefully selected holiday homes.
        </p>
      </div>
      <HomePageClient />
    </>
  );
}

