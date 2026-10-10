import { BackHome, Shell } from "./ui";

export default function NotFound() {
  return (
    <Shell>
      <div className="not-found" role="status">
        <span className="not-found-code" aria-hidden="true">৪০৪</span>
        <h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
        <p>আপনি যে পণ্য বা পৃষ্ঠা খুঁজছেন তা স্থানান্তরিত হয়েছে বা লিংকটি সঠিক নয়।</p>
        <div className="not-found-actions">
          <BackHome />
        </div>
      </div>
    </Shell>
  );
}