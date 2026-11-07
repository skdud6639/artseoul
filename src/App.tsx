import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SelectionProvider from './state/SelectionProvider';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';

const ArtworksPage = lazy(() =>
  import('./pages/Artworks').then((m) => ({ default: m.ArtworksPage })),
);
const ArtworkPage = lazy(() =>
  import('./pages/Artworks').then((m) => ({ default: m.ArtworkPage })),
);
const SelectionPage = lazy(() =>
  import('./pages/Artworks').then((m) => ({ default: m.SelectionPage })),
);
const ArtistsPage = lazy(() =>
  import('./pages/Artists').then((m) => ({ default: m.ArtistsPage })),
);
const ArtistPage = lazy(() =>
  import('./pages/Artists').then((m) => ({ default: m.ArtistPage })),
);
const RentalPage = lazy(() =>
  import('./pages/Services').then((m) => ({ default: m.RentalPage })),
);
const ConsultingPage = lazy(() =>
  import('./pages/Services').then((m) => ({ default: m.ConsultingPage })),
);
const FaqPage = lazy(() =>
  import('./pages/Services').then((m) => ({ default: m.FaqPage })),
);
const ProjectsPage = lazy(() =>
  import('./pages/Projects').then((m) => ({ default: m.ProjectsPage })),
);
const ProjectPage = lazy(() =>
  import('./pages/Projects').then((m) => ({ default: m.ProjectPage })),
);
const AboutPage = lazy(() =>
  import('./pages/About').then((m) => ({ default: m.AboutPage })),
);
const InquiryPage = lazy(() =>
  import('./pages/Inquiry').then((m) => ({ default: m.InquiryPage })),
);
const InquiryCompletePage = lazy(() =>
  import('./pages/Inquiry').then((m) => ({ default: m.InquiryCompletePage })),
);
const AdminPage = lazy(() =>
  import('./pages/Admin').then((m) => ({ default: m.AdminPage })),
);
const PolicyPage = lazy(() =>
  import('./pages/Policy').then((m) => ({ default: m.PolicyPage })),
);

export default function App() {
  return (
    <BrowserRouter>
      <SelectionProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="artworks" element={<ArtworksPage />} />
            <Route path="artworks/:slug" element={<ArtworkPage />} />
            <Route path="selection" element={<SelectionPage />} />
            <Route path="artists" element={<ArtistsPage />} />
            <Route path="artists/:slug" element={<ArtistPage />} />
            <Route path="rental" element={<RentalPage />} />
            <Route path="consulting" element={<ConsultingPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="support/faq" element={<FaqPage />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="inquiry/complete" element={<InquiryCompletePage />} />
            <Route path="admin/inquiries" element={<AdminPage />} />
            <Route path="privacy" element={<PolicyPage type="privacy" />} />
            <Route path="terms" element={<PolicyPage type="terms" />} />
            <Route path="rental/terms" element={<PolicyPage type="rental" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SelectionProvider>
    </BrowserRouter>
  );
}
