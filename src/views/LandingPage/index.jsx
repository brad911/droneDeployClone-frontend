import CompanyGroup from './companyGroup';
import Hero from './hero';
import IndustryCapture from './industryCapture';
import LandingPageFooter from './landingPageFooter';
import LandingPageHeader from './landingPageHeader';
import MainLayout from './LandingPagelayout';
import SiteView from './siteView';

function LandingPage() {
  return (
    <>
      <MainLayout>
        <LandingPageHeader />
        <Hero />
        <SiteView />
        <IndustryCapture />
        <CompanyGroup />
        <LandingPageFooter />
      </MainLayout>
    </>
  );
}

export default LandingPage;
