// Blog post data
// To add a new post: add an entry to POSTS with a markdown `content` string.

/* ── Posts ───────────────────────────────────────────────────────── */
const POSTS = [
  {
    slug: 'shooting-the-ironman',
    title: 'From the Sidelines to the Finish Line',
    excerpt: 'What it takes to photograph 140.6 miles of racing — and why triathlon might be the most demanding subject in sports photography.',
    coverImage: '/photos/IRONMAN%20-%20Dylan_Bike_Banner.jpg',
    imagePosition: 'center 40%',
    category: 'Sports',
    date: '2026-06-12',
    readTime: '7 min read',
    content: `
The alarm goes off at 4:45 AM and you are already awake. That's how race day works. By the time you've loaded the car and driven to the course, the transition area is already buzzing — thousands of athletes checking tire pressure, mixing nutrition, pulling on wetsuits in the dark. The energy is something you can't manufacture. You either show up for it or you don't.

An Ironman is 140.6 miles: 2.4 miles of open-water swimming, 112 miles on the bike, and a full marathon to finish. The fastest professionals are done in eight hours. Most competitors are out there for twelve, fourteen, sixteen. The cutoff is midnight. All of that — the aspiration, the suffering, the quiet negotiation athletes have with themselves somewhere around mile 80 on the bike — is what you're trying to find with a camera.

## Why Triathlon Is the Hardest Sport to Photograph

A football game has a field. Wrestling has a mat. Even a marathon has a defined finish chute where you know something is going to happen. Triathlon gives you a 112-mile bike course, an open road, and 2,000 athletes spread across it. There is no single vantage point. You have to make decisions.

The swim is nearly impossible — athletes are in the water, often before sunrise, and from shore you're photographing caps and white water. The transition areas are chaotic and fast. The bike leg is where you can really work, if you've scouted the course and positioned yourself somewhere with clean light and a good background. The run is where the story lives.

What I've learned is that the best race photos rarely come from the obvious spots. Everyone clusters at the finish line. The images that actually mean something to an athlete are the ones from the middle — mile 60 on the bike, mile 18 of the run — when they weren't thinking about the camera. When they were just in it.

## The Bike Leg: 112 Miles of Decisions

![Dylan on the bike leg of the Ironman](/photos/IRONMAN%20-%20Dylan_Bike_Banner.jpg)

This is Dylan, mid-race on the bike. By the time I got this shot, he'd already swum 2.4 miles and had another 50 miles to go before he'd even lace up his running shoes. You'd never know it from his position — head down, power through the pedals, completely absorbed in the work.

Photographing cyclists at race speed is a technical problem first. You're working with fast shutter speeds to freeze motion without losing the sense of movement, pre-focusing on a point on the road because you don't have time to track and acquire as the athlete comes through. You get one pass. Sometimes two if the course has a nearby turnaround. You have to be committed to your frame before they arrive.

![Dante on the bike leg of the Ironman](/photos/IRONMAN%20-%20Dante_Bike_Banner.jpg)

Dante is in the same stretch. What I'm reading in the position, the helmet angle, the grip on the bars — this athlete is managing his effort, not surviving it. That's the difference between a good bike photo and an interesting one. Anyone can photograph a cyclist in motion. The image worth keeping is the one that shows you who the person is *inside* the race.

## The Run: Where Everything Shows

By the marathon, athletes have been racing for six, eight, ten hours. The veneer is gone. The face you see on the run is the real one — the one that's done the math about how much is left and decided to keep moving anyway.

![Dylan on the run leg of the Ironman](/photos/IRONMAN%20-%20Dylan_Run_Banner.jpg)

Dylan here has already covered the swim and the full 112 miles. His form is still purposeful. There's a version of this photo that shows someone grimacing, shuffling, reduced — that's a real moment too, and sometimes athletes treasure those most because they show what the race actually cost. But there's something equally honest in a frame where the training is still visible: a person doing exactly what they prepared to do, exactly as hard as they planned.

![Dante on the run leg of the Ironman](/photos/IRONMAN%20-%20Dante_Run_Banner.jpg)

Dante in the same miles. You can read everything you need to know from a runner's posture — the shoulder set, the cadence, where the gaze is going. The run photos are the ones athletes come back to years later. The bike photo is impressive. The run photo is honest.

## The Finish

![Dylan and Dante at the Ironman finish](/photos/IRONMAN%20-%20Dylan_Dante_Finish.jpg)

This is the frame I always want to be in position for — two athletes who trained together, raced the same day, and made it to the other side of 140.6 miles. The finish line energy is something else entirely. The suffering stops. The math stops. What's left is just the fact of having done it.

I've photographed a lot of finish lines. The thing that never gets ordinary is watching someone cross who wasn't sure they could.

## What You're Really Hiring a Photographer For

Most race finishers have an official finish-line photo. It's fine. You're wearing your medal, you're crossing the timing mat, there are a thousand people crossing that same mat that day and the photo looks like all of them.

What a dedicated race photographer gives you is the race itself — the miles before the finish, the moments when you were just an athlete doing the work. Those images are harder to make because they require being in the right place at the right time with enough experience to know what to look for. But they're the ones that actually tell your story.

> "The best sports images aren't made at the finish line. They're made somewhere in the middle, when the athlete forgot anyone was watching."

If you're racing this summer — triathlon, road race, cycling event — and you want images that go beyond the finish-line chute, [let's talk](/about#contact). I cover events throughout New Jersey, New York, and the Philadelphia area.

---

**Tom Zarcone** is a sports and portrait photographer based in Bridgewater, NJ, covering athletes and events across New Jersey, New York, and Philadelphia.
`,
  },
];

/* ── API ─────────────────────────────────────────────────────────── */
export function getAllPosts() {
  return POSTS;
}

export function getPostBySlug(slug) {
  return POSTS.find(p => p.slug === slug) || null;
}
