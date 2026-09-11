import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

const POLICIES = {
  shipping: { title: "Shipping" },
  returns: { title: "Returns" },
  privacy: { title: "Privacy Policy" },
  terms: { title: "Terms" },
};

export default function Policy() {
  const { slug } = useParams();
  const policy = POLICIES[slug];
  if (!policy) return <Navigate to="/" replace />;

  return (
    <main className="hg-arch hg-policy" data-testid={`policy-page-${slug}`}>
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">Customer Care</p>
          <h1 className="hg-arch-title" data-testid="policy-title">{policy.title}</h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="policy-placeholder-note">
            This policy has not been published yet. The official {policy.title.toLowerCase()} details
            will appear here once finalized by the house.
          </p>
          <div className="hg-policy-actions">
            <Link to="/contact" className="hg-btn hg-btn--ghost hg-btn--small" data-testid="policy-contact-link">
              Questions? Contact the house
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
