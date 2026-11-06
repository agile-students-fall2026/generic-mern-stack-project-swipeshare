import faqImage from "../assets/faq-image.jpg";
import { Header } from "../components/Header";
import "./HowItWorksPage.css";

const steps = [
  "Sign in with your NYU email",
  "Have extra meal swipes? Post them as a listing with the dining hall, time, and price.",
  "Need a meal? Browse the listings and pick one that works for you.",
  "Meet at the dining hall, the seller swipes you in, and you both leave a rating.",
];

const faqs = [
  {
    question: "What is a meal swipe?",
    answer:
      "A meal swipe is a exchange that you can use at a dining hall(buffet) or a meal that consists of entrée, choice of fruit, side salad, bag of chips or side dish and a fountain drink",
  },
  {
    question: "Who can use SwipeShare?",
    answer: "Any student who has an NYU email can buy and sell swipes",
  },
  {
    question: "Do I have to meet the other student in person?",
    answer:
      "Yes. The seller has to swipe you in at the dining hall, so you guys have to meet there at the time you agreed on.",
  },
  {
    question: "Can I take down a listing after I post it?",
    answer:
      "Yes. Go to My Listings to see the swipes you posted and remove any you no longer want to sell.",
  },
];

function HowItWorksPage() {
  return (
    <>
      <Header title="How It Works" />
      <main className="how-page">
        <img
          className="how-image"
          src={faqImage}
          alt="People sitting and standing around giant FAQ letters"
        />

        <section className="how-section">
          <h2 className="how-title">How SwipeShare works</h2>
          <p className="how-intro">
            SwipeShare connects students who have extra meal swipes with
            students who need one.
          </p>

          <ol className="how-steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="how-section">
          <h2 className="how-subtitle">FAQ</h2>

          {faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary className="faq-question">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

export default HowItWorksPage;
