const FACTS = [
  { emoji: "😴", fact: "Cats sleep 12–16 hours a day — up to 70% of their lives." },
  { emoji: "👃", fact: "A cat's nose print is as unique as a human fingerprint." },
  { emoji: "🦘", fact: "Cats can jump up to 6 times their own body length in a single leap." },
  { emoji: "🗣️", fact: "Cats make over 100 distinct vocalizations. Dogs make about 10." },
  { emoji: "🐾", fact: "A group of cats is called a clowder. A group of kittens is a kindle." },
  { emoji: "🏺", fact: "The oldest known pet cat lived 9,500 years ago — found in a grave in Cyprus." },
  { emoji: "🧠", fact: "Cats have 300 million neurons in their cerebral cortex. Dogs have 160 million." },
  { emoji: "⚡", fact: "A cat's heart beats 140–220 times per minute — roughly twice as fast as a human's." },
  { emoji: "🌙", fact: "Cats are crepuscular — most active at dawn and dusk, not purely nocturnal." },
  { emoji: "🎵", fact: "A cat's purr vibrates at 25–150 Hz — a frequency known to promote bone healing." },
  { emoji: "👁️", fact: "Cats can see in light 6 times dimmer than humans can detect." },
  { emoji: "🌍", fact: "There are an estimated 600 million domestic cats worldwide." },
];

const CARE = [
  {
    title: "🍖 Nutrition",
    points: [
      "Cats are obligate carnivores — they must eat meat to survive.",
      "Fresh water should always be available; many cats prefer running water.",
      "Wet food supports hydration; dry food alone can contribute to kidney issues.",
      "Avoid onions, garlic, grapes, raisins, chocolate, and xylitol — all toxic to cats.",
      "Kittens, adults, and seniors have different caloric and nutrient needs.",
    ],
  },
  {
    title: "🏥 Health",
    points: [
      "Annual vet visits are recommended for adult cats; twice yearly for seniors (7+).",
      "Core vaccines: rabies, FVRCP (distemper combo). Keep them current.",
      "Spaying/neutering reduces cancer risk and unwanted behavior.",
      "Dental disease affects 70% of cats over age 3 — tooth brushing helps.",
      "Watch for changes in litter box habits — they're often the first sign of illness.",
    ],
  },
  {
    title: "🧠 Behavior & Enrichment",
    points: [
      "Cats need vertical space — cat trees and shelves reduce stress in multi-cat homes.",
      "15 minutes of interactive play per day significantly reduces behavior problems.",
      "Scratching is a natural behavior; provide appropriate posts to protect furniture.",
      "Most cats prefer their litter box in a quiet, low-traffic area.",
      "Slow blinking at your cat is a sign of trust — they often blink back.",
    ],
  },
  {
    title: "🐱 Introducing a New Cat",
    points: [
      "Separate the new cat in one room for the first week — scent swap before visual contact.",
      "Feed cats on opposite sides of the same door to build positive associations.",
      "Never force interaction; let cats set the pace of introduction.",
      "Hissing and swatting during introductions is normal — watch for escalation.",
      "Most cats take 2–4 weeks to fully adjust to a new companion.",
    ],
  },
];

const BREEDS = [
  { name: "Maine Coon", trait: "Gentle giant", desc: "One of the largest domestic breeds. Dog-like loyalty, tufted ears, and a love of water." },
  { name: "Siamese", trait: "Vocal & social", desc: "Extremely communicative and people-oriented. One of the oldest recognized breeds." },
  { name: "Persian", trait: "Calm & regal", desc: "Long, luxurious coat and a quiet temperament. Requires daily grooming." },
  { name: "Bengal", trait: "Wild look, domestic soul", desc: "Spotted coat from Asian Leopard Cat ancestry. High energy and very playful." },
  { name: "Scottish Fold", trait: "Distinctive folded ears", desc: "Known for owl-like appearance and calm demeanor. Good with families." },
  { name: "Ragdoll", trait: "Goes limp when held", desc: "Floppy, relaxed personality. One of the most affectionate and gentle breeds." },
];

export default function FactsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Facts */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">🧠 Cat Facts</h1>
        <p className="text-stone-500 mb-8">Things that make cats endlessly fascinating.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACTS.map(({ emoji, fact }, i) => (
            <div key={i} className="cat-card bg-white rounded-2xl p-5 shadow flex gap-3 items-start">
              <span className="text-2xl mt-0.5">{emoji}</span>
              <p className="text-stone-700 text-sm leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Care guide */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">🐾 Cat Care Guide</h2>
        <p className="text-stone-500 mb-8">Everything you need to keep your cat healthy and happy.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARE.map(({ title, points }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow cat-card">
              <h3 className="font-bold text-lg text-stone-800 mb-4">{title}</h3>
              <ul className="space-y-2">
                {points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-600 leading-relaxed">
                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Breed spotlight */}
      <section>
        <h2 className="text-3xl font-bold text-stone-800 mb-2">🐈 Breed Spotlight</h2>
        <p className="text-stone-500 mb-8">Six popular breeds and what makes them special.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BREEDS.map(({ name, trait, desc }) => (
            <div key={name} className="cat-card bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-stone-800 text-lg">{name}</h3>
              <span className="inline-block bg-amber-400 text-stone-800 text-xs font-semibold px-2 py-0.5 rounded-full mb-3">
                {trait}
              </span>
              <p className="text-stone-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
