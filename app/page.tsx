"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const unhealthyFoods = [
  "oreos", "oreo", "chocolate", "candy", "skittles", "m&ms", "snickers", "twix",
  "kit kat", "reeses", "reese's", "gummy bears", "gummy worms", "sour patch",
  "starburst", "jolly rancher", "nerds", "lollipop", "caramel", "toffee", "fudge",
  "hershey", "milka", "toblerone", "ferrero rocher", "ferrero", "nutella",
  "kinder", "kinder bueno", "kinder joy", "bounty", "mars bar", "mars",
  "dubai chocolate", "dubai choco", "pistachio chocolate", "knafeh chocolate",
  "fix dessert", "viral chocolate", "lindt", "godiva", "ghirardelli",
  "cadbury", "crunchie", "butterfinger", "baby ruth", "3 musketeers",
  "almond joy", "mounds", "payday", "whoppers", "rolo", "peanut butter cups",
  "york peppermint", "andes", "sugar daddy", "ring pop", "warheads", "airheads",
  "laffy taffy", "twizzlers", "red vines", "swedish fish", "trolli", "haribo",
  "peach rings", "cola bottles", "mcdonald's", "mcdonalds", "burger king",
  "wendy's", "wendys", "taco bell", "kfc", "chick-fil-a", "chick fil a",
  "popeyes", "five guys", "shake shack", "in-n-out", "whataburger", "sonic",
  "dairy queen", "jack in the box", "white castle", "del taco", "big mac",
  "whopper", "french fries", "fries", "onion rings", "nuggets", "chicken nuggets",
  "hot dog", "corn dog", "loaded fries", "mcflurry", "blizzard", "chips",
  "doritos", "lays", "pringles", "cheetos", "fritos", "funyuns", "cheez its",
  "goldfish", "ritz crackers", "popcorn", "kettle corn", "cheese puffs",
  "bugles", "takis", "hot cheetos", "flamin hot", "ruffles", "nachos",
  "tortilla chips", "tostitos", "pork rinds", "beef jerky", "slim jim",
  "ice cream", "gelato", "soft serve", "frozen yogurt", "froyo", "cake",
  "cupcake", "brownie", "cookie", "cookies", "donut", "donuts", "doughnut",
  "krispy kreme", "dunkin", "pie", "cheesecake", "pudding", "waffle",
  "pancakes", "churro", "churros", "cotton candy", "funnel cake", "beignet",
  "cinnamon roll", "cinnabon", "muffin", "croissant", "pain au chocolat",
  "pop tart", "pop tarts", "twinkie", "ding dong", "swiss roll", "soda",
  "coke", "coca cola", "pepsi", "sprite", "dr pepper", "mountain dew",
  "fanta", "root beer", "energy drink", "red bull", "monster", "bang",
  "celsius", "prime", "slurpee", "milkshake", "frappuccino", "bubble tea",
  "boba", "thai tea", "sweet tea", "lemonade", "kool aid", "capri sun",
  "hot chocolate", "mocha", "caramel macchiato", "white mocha", "vanilla latte",
  "pizza", "pepperoni pizza", "calzone", "garlic bread", "mozzarella sticks",
  "lasagna", "mac and cheese", "macaroni", "ramen", "instant noodles",
  "cup noodles", "fried rice", "spam", "dumplings", "spring rolls", "egg rolls",
  "crab rangoon", "orange chicken", "lo mein", "chow mein", "pad thai",
  "fried chicken", "fried fish", "fish and chips", "fried shrimp", "fried oreos",
  "fried twinkies", "fried pickles", "jalapeno poppers", "potato skins",
  "burger", "cheeseburger", "smash burger", "bacon burger", "burrito",
  "quesadilla", "chimichanga", "cheesesteak", "philly cheesesteak", "meatball sub",
  "grilled cheese", "monte cristo", "wings", "buffalo wings", "hot wings",
  "lucky charms", "cocoa puffs", "frosted flakes", "fruit loops", "froot loops",
  "cap'n crunch", "reese's puffs", "cocoa krispies", "cinnamon toast crunch",
  "white bread", "bagel", "hash browns", "tater tots", "sausage", "bacon",
  "breakfast sandwich", "pocky", "hello panda", "mochi ice cream", "mochi",
  "stroopwafel", "biscoff", "tim tams", "digestive biscuits"
]

const healthyFoods = [
  "apple", "grapes", "banana", "orange", "strawberry", "blueberry", "watermelon",
  "mango", "salad", "broccoli", "spinach", "kale", "carrot", "celery",
  "cucumber", "tomato", "avocado", "quinoa", "oatmeal", "yogurt", "almonds",
  "walnuts", "salmon", "tofu", "lentils", "chickpeas", "brown rice",
  "sweet potato", "hummus", "edamame", "green tea", "rice cake", "rice cakes",
  "granola bar", "protein bar", "smoothie", "acai bowl", "chia seeds"
]

type FoodStatus = "unhealthy" | "healthy" | "gibberish" | "empty"

function checkFood(input: string): FoodStatus {
  if (!input.trim()) return "empty"
  const lower = input.toLowerCase().trim()
  if (healthyFoods.some((f) => lower.includes(f))) return "healthy"
  if (unhealthyFoods.some((f) => lower.includes(f))) return "unhealthy"
  return "gibberish"
}

type Result = {
  food: string
  calories: number
  serving: string
  swap: { name: string; amount: string; calories: number; reason: string }
  why: { reason: string; what_body_needs: string }
  burn: { exercise: string; duration: number; intensity: string; tip: string }
}

const FULL_TITLE = "fix_my_craving"

export default function Home() {
  const [craving, setCraving] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [titleDone, setTitleDone] = useState(false)

  const foodStatus = checkFood(craving)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayedTitle(FULL_TITLE.slice(0, i + 1))
      i++
      if (i === FULL_TITLE.length) {
        clearInterval(interval)
        setTitleDone(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  async function analyzeCarving() {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ craving }),
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'RobotoMono';
          src: url('/RobotoMono-VariableFont_wght.ttf') format('truetype');
          font-weight: 100 900;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf8f5; }
        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.9em;
          background: #7a9e7e;
          margin-left: 3px;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
          border-radius: 1px;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f0ebe3;
          padding: 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .input-field {
          width: 100%;
          background: #faf8f5;
          border: 1.5px solid #e8e0d5;
          border-radius: 14px;
          padding: 0.875rem 1.25rem;
          font-family: 'RobotoMono', monospace;
          font-size: 0.9rem;
          color: #3d3530;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .input-field::placeholder { color: #c4b8ac; }
        .input-field:focus { border-color: #a8c5a0; background: #fff; }
        .btn-main {
          width: 100%;
          background: #7a9e7e;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 0.9rem;
          font-family: 'RobotoMono', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          margin-top: 0.75rem;
        }
        .btn-main:hover:not(:disabled) { background: #6a8e6e; transform: translateY(-1px); }
        .btn-main:active:not(:disabled) { transform: translateY(0); }
        .btn-main:disabled { background: #e8e0d5; color: #c4b8ac; cursor: not-allowed; }
        .tag {
          display: inline-block;
          font-family: 'RobotoMono', monospace;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 0.6rem;
        }
        .tag-purple { background: #f3eef9; color: #8b6bb1; }
        .tag-green { background: #eaf4ea; color: #5a8a5e; }
        .tag-orange { background: #fef2e8; color: #c4733a; }
        .fade-in {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .deco {
          position: fixed;
          pointer-events: none;
          user-select: none;
          border-radius: 50%;
          overflow: hidden;
        }
        .mono { font-family: 'RobotoMono', monospace; }
      `}</style>

      {/* Decorative blurred images */}
      <div className="deco" style={{
        bottom: "-80px", left: "-80px", width: "400px", height: "350px",
        opacity: 0.42, filter: "blur(8px)"
      }}>
        <Image src="/logo1.jpg" alt="" fill style={{ objectFit: "cover" }} />
      </div>
      <div className="deco" style={{
        top: "-60px", right: "-60px", width: "260px", height: "260px",
        opacity: 0.1, filter: "blur(6px)", borderRadius: "0"
      }}>
        <Image src="/logo3.jpg" alt="" fill style={{ objectFit: "cover" }} />
      </div>

      <main style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "88px", height: "88px", borderRadius: "50%", overflow: "hidden",
              border: "3px solid #f0ebe3", position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <Image src="/logo.jpg" alt="fix_my_craving" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
          <h1 className="mono" style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "#3d3530",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "0.8rem",
          }}>
            {displayedTitle}
            {!titleDone && <span className="cursor" />}
          </h1>
          <p className="mono" style={{
            color: "#b0a89e",
            fontSize: "1rem",
            letterSpacing: "0.05em",
          }}>
            type a craving. get a smarter choice.
          </p>
        </div>

        {/* Input card */}
        <div className="card" style={{ width: "100%", maxWidth: "460px" }}>
          <label className="mono" style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#b0a89e",
            marginBottom: "0.6rem",
          }}>
            what are you craving?
          </label>
          <input
            type="text"
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && foodStatus === "unhealthy" && analyzeCarving()}
            placeholder="oreos, dubai chocolate, takis..."
            className="input-field"
          />
          <button
            onClick={analyzeCarving}
            disabled={foodStatus !== "unhealthy" || loading}
            className="btn-main"
          >
            {loading ? "analyzing your craving..." : "analyze my craving →"}
          </button>

          {foodStatus === "healthy" && craving && (
            <p className="mono" style={{ textAlign: "center", fontSize: "0.78rem", color: "#7a9e7e", marginTop: "0.75rem" }}>
              🥦 {craving}?? you&apos;re already winning — go eat it!
            </p>
          )}
          {foodStatus === "gibberish" && craving && (
            <p className="mono" style={{ textAlign: "center", fontSize: "0.78rem", color: "#c47a6a", marginTop: "0.75rem" }}>
              🤨 that doesn&apos;t look like a food. try &quot;oreos&quot; or &quot;dubai chocolate&quot;!
            </p>
          )}
        </div>

        {error && (
          <p className="mono" style={{ color: "#c47a6a", fontSize: "0.82rem", marginTop: "0.75rem" }}>
            {error}
          </p>
        )}

        {/* Results */}
        {result && (
          <div style={{ width: "100%", maxWidth: "460px", marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

            {/* Overview */}
            <div className="card fade-in" style={{ animationDelay: "0ms", borderLeft: "3px solid #e8c9b8" }}>
              <p className="mono" style={{ fontSize: "0.68rem", color: "#c4b8ac", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                you&apos;re craving
              </p>
              <p className="mono" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3d3530", marginBottom: "0.2rem" }}>
                {result.food}
              </p>
              <p className="mono" style={{ fontSize: "0.78rem", color: "#c4b8ac" }}>
                ~{result.calories} cal · {result.serving}
              </p>
            </div>

            {/* Why */}
            <div className="card fade-in" style={{ animationDelay: "100ms" }}>
              <span className="tag tag-purple">🧠 why you want this</span>
              <p style={{ fontSize: "0.88rem", color: "#3d3530", lineHeight: 1.65, marginBottom: "0.5rem" }}>
                {result.why.reason}
              </p>
              <p className="mono" style={{ fontSize: "0.75rem", color: "#9e8e82" }}>
                your body needs → {result.why.what_body_needs}
              </p>
            </div>

            {/* Swap */}
            <div className="card fade-in" style={{ animationDelay: "200ms" }}>
              <span className="tag tag-green">🌿 smarter swap</span>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#3d3530", marginBottom: "0.3rem" }}>
                {result.swap.name}
              </p>
              <p className="mono" style={{ fontSize: "0.78rem", color: "#7a9e7e", fontWeight: 600, marginBottom: "0.4rem" }}>
                {result.swap.amount}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#7a7068", lineHeight: 1.65, marginBottom: "0.4rem" }}>
                {result.swap.reason}
              </p>
              <p className="mono" style={{ fontSize: "0.72rem", color: "#a8c5a0", fontWeight: 600 }}>
                ~{result.swap.calories} cal
              </p>
            </div>

            {/* Burn */}
            <div className="card fade-in" style={{ animationDelay: "300ms" }}>
              <span className="tag tag-orange">🔥 burn it off</span>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#3d3530", marginBottom: "0.3rem" }}>
                {result.burn.exercise} · {result.burn.duration} min to burn {result.calories} cal
              </p>
              <p className="mono" style={{ fontSize: "0.78rem", color: "#c4733a", fontWeight: 600, marginBottom: "0.4rem" }}>
                {result.burn.intensity}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#7a7068", lineHeight: 1.65 }}>
                {result.burn.tip}
              </p>
            </div>

          </div>
        )}

        {/* Footer */}
        <p className="mono" style={{
          marginTop: "3rem",
          fontSize: "0.75rem",
          color: "#635f5c",
          letterSpacing: "0.06em",
        }}>
          made with 🌿 fix_my_craving · <a href="https://linkedin.com/in/puttipa-seraypheap" style={{color: "#94908a", textDecoration: "none"}}>linkedin</a>
        </p>
        

      </main>
    </>
  )
}