import { ResumePreviewProvider } from '@/components/common/resume_previewer_context';
import Footer from '@/components/ui/footer';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResumePreviewProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ResumePreviewProvider>
  );
}
