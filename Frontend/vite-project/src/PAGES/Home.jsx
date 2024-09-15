import HeroSection from './Components/HeroSection/HeroSection.jsx';
import HomeSection from './Components/HomeSection/HomeSection.jsx';
import DiscoverSection from './Components/DiscoverSection/DiscoverSection.jsx';
import TrendsSection from './Components/TrendSection/TrendSection.jsx';
import LoanSection from './Components/LoanSection/LoanSection.jsx';
import Footer from './Components/FooterSection/Footer.jsx';

export default function Home(){
    return(
        <>
            <HeroSection/>
            <HomeSection/>
            <DiscoverSection />
            <TrendsSection />
            <LoanSection />
            <Footer />
        </>
    )
}
    