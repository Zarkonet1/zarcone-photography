'use client';

import { useState, useEffect } from 'react';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  { text: "Zarcone Photography has been such a pleasure to work with and to get to know! Your photos are so beyond expectations. I love that you don't just take pictures, you capture moments. You are also so easy to work with! You made the entire process easy and stress-free. You're totally awesome and we'll see you for our next event.", name: 'Patricia' },
  { text: "Photo shoot was great and the pictures came out amazing!! Will definitely be using Zarcone Photography again. Tom was super helpful with everything from start to finish including some special editing I wanted done.", name: 'Joseph' },
  { text: "I had a session booked for holiday photos and we had our baby with us. Super professional and the photos were phenomenal even though the baby wasn't quite in the mood. They followed up to make sure everything went ok — I can't wait to do more with them!", name: 'Julia' },
  { text: "Tom & Chloe are awesome! They make the experience fun and comfortable, and the photos came out great. We just had our second family photoshoot with them, and we will definitely be using them again.", name: 'Meghann' },
  { text: "Tom and the team at Zarcone Photography are incredible to work with and are top notch professionals. We unfortunately needed to move our outdoor charity event up by 24 hours due to an impending storm, and Tom jumped into action and accommodated the date change. I don't know any other photography group that would be able to pivot so quickly and with a positive outlook.", name: "Andi's Team" },
  { text: "We used Zarcone Photography for capturing a 3 generation family photo and the service, experience and quality were all top notch! Tom & his team are easy to communicate with, very open and efficient! Thank you Tom for creating a timeless memory for my family and me.", name: 'Leon & Theresa' },
  { text: "I seriously can't say enough positive things about our experience having our family photos done with Zarcone Photography!!! I have a seriously stubborn 3 year old that refuses to get his pic taken. Somehow Tom and his assistant got him to take pictures and were BEYOND patient!! The added bonus was the pics came out amazing!!!", name: 'Megan' },
  { text: "Working with Zarcone Photography this season was a great experience. Tom is an excellent sports photographer who captured incredible photos that showcased the energy, emotion, and personality of our athletes. He also went beyond photography by helping create individual graphics, senior posters, postseason group graphics, and photo gifts. Looking forward to working with him again next season!", name: 'Erika' },
  { text: "Tom was an absolute pleasure to work with. He was patient, clear and detailed. My team had a wonderful experience taking photos for their senior night. We had a large group and it was no challenge for him to manage. I highly recommend Tom and his team for any projects that you may have.", name: 'Coach Adam' },
  { text: "Great action photos of the wrestling season!", name: 'Rick' },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive(i => (i + 1) % TESTIMONIALS.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  function goTo(i) {
    setVisible(false);
    setTimeout(() => { setActive(i); setVisible(true); }, 400);
  }

  const t = TESTIMONIALS[active];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>What Clients Say</p>
        <div className={`${styles.quoteWrap} ${visible ? styles.show : styles.hide}`}>
          <div className={styles.mark}>"</div>
          <blockquote className={styles.quote}>{t.text}</blockquote>
          <cite className={styles.cite}>— {t.name}</cite>
        </div>
        <div className={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
