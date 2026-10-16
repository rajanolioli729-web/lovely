// Personalize the site here: names, messages, memories, and reasons.
const siteConfig = {
  name: 'Miss Anusa',
  stories: [
    { title: 'The first conversation', text: 'I had no idea a simple hello could become something I looked forward to every day. Somehow, our conversations became my favorite place.' },
    { title: 'Our kind of laughter', text: 'Even from far away, you find a way to make me laugh. I could never get tired of our talks, our jokes, or being us.' },
    { title: 'Closer every day', text: 'We have not met in person yet, but each conversation makes the distance feel a little smaller. I cannot wait for the memories still ahead of us.' }
  ],
  reasons: [
    'The way you make even the quietest moments feel like somewhere I belong.',
    'Your laugh can brighten my day, even when we are miles apart.',
    'How kind you are, especially in all the little ways you probably think no one notices.',
    'You make being myself feel easy, and knowing you feels like home.',
    'The way you see beauty in things other people walk right past.',
    'Because the world is gentler, brighter, and much more wonderful with you in it.'
  ],
  letter: {
    greeting: 'My dearest Anusa,',
    paragraphs: [
      'There are a thousand little ways you make life brighter, and somehow I keep finding new ones. The way you laugh, the way you care, the way simply being near you can make any place feel like home.',
      'Thank you for being exactly who you are. I hope you always know that you are cherished, appreciated, and loved more than these words could ever hold.'
    ],
    signoff: 'Always yours, with all my heart'
  },
  proposal: {
    question: 'Will you say yes to our next chapter, Miss Anusa?',
    yesMessage: 'You just made me the happiest person. I cannot wait to keep getting closer, one conversation and one day at a time. Thank you for choosing this little story with me.',
    emailAccessKey: '818538c1-c331-421e-8f65-68f1ad75f127'
  },
  surprise: 'If I could give you one thing, it would be the ability to see yourself through my eyes, just for a moment. Then you would know how completely wonderful, beautiful, and loved you are. Today, tomorrow, and in every little moment in between.'
};

const storyGrid = document.querySelector('#story-grid');
let lastReason = -1;

document.title = `For ${siteConfig.name}, with love`;
document.querySelector('#hero-title').innerHTML = `For my beautiful<br><em>${escapeHtml(siteConfig.name)}</em>`;
document.querySelector('.site-footer p').innerHTML = `Made with love, especially for <em>${escapeHtml(siteConfig.name)}.</em>`;
document.querySelector('#proposal-title').textContent = siteConfig.proposal.question;

const fallingHearts = document.querySelector('#falling-hearts');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  [6, 19, 34, 67, 82, 95].forEach((position) => {
    const heart = document.createElement('span');
    heart.className = 'falling-heart';
    heart.textContent = '♥';
    heart.style.setProperty('--heart-left', `${position}%`);
    heart.style.setProperty('--heart-size', `${10 + Math.random() * 9}px`);
    heart.style.setProperty('--heart-duration', `${14 + Math.random() * 8}s`);
    heart.style.setProperty('--heart-delay', `${-Math.random() * 20}s`);
    heart.style.setProperty('--heart-drift', `${Math.random() * 60 - 30}px`);
    fallingHearts.append(heart);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderStories() {
  storyGrid.innerHTML = siteConfig.stories.map((story, index) => `
    <article class="story-card">
      <span class="story-number">0${index + 1}</span>
      <h3>${escapeHtml(story.title)}</h3>
      <p>${escapeHtml(story.text)}</p>
    </article>`).join('');
}

function renderLetter() {
  const body = document.querySelector('#letter-body');
  const paragraphs = siteConfig.letter.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  body.innerHTML = `<p>${escapeHtml(siteConfig.letter.greeting)}</p>${paragraphs}<p class="letter-signoff"><span>${escapeHtml(siteConfig.letter.signoff)}</span></p>`;
}

renderStories();
renderLetter();

document.querySelector('#reason-button').addEventListener('click', () => {
  if (siteConfig.reasons.length === 0) return;
  let next = Math.floor(Math.random() * siteConfig.reasons.length);
  if (siteConfig.reasons.length > 1) {
    while (next === lastReason) next = Math.floor(Math.random() * siteConfig.reasons.length);
  }
  lastReason = next;
  document.querySelector('#reason-text').textContent = siteConfig.reasons[next];
});

const letterToggle = document.querySelector('#letter-toggle');
const letterBody = document.querySelector('#letter-body');
letterToggle.addEventListener('click', () => {
  const expanded = letterToggle.getAttribute('aria-expanded') === 'true';
  letterToggle.setAttribute('aria-expanded', String(!expanded));
  letterToggle.querySelector('.letter-toggle-label').textContent = expanded ? 'Open when you\'re ready' : 'Close the letter';
  letterBody.hidden = expanded;
});

document.querySelector('#surprise-button').addEventListener('click', (event) => {
  const message = document.querySelector('#surprise-message');
  message.textContent = siteConfig.surprise;
  message.hidden = false;
  event.currentTarget.setAttribute('aria-expanded', 'true');
  event.currentTarget.innerHTML = 'A little more love <span aria-hidden="true">♡</span>';
});

const proposalActions = document.querySelector('#proposal-actions');
const proposalNo = document.querySelector('#proposal-no');
const proposalResponse = document.querySelector('#proposal-response');
const proposalEmailStatus = document.querySelector('#proposal-email-status');
const proposalYes = document.querySelector('#proposal-yes');
let proposalEmailSent = false;
let proposalEmailSending = false;

function moveNoButton(event) {
  const maxLeft = proposalActions.clientWidth - proposalNo.offsetWidth;
  const maxTop = proposalActions.clientHeight - proposalNo.offsetHeight;
  const actionBounds = proposalActions.getBoundingClientRect();
  const yesBounds = document.querySelector('#proposal-yes').getBoundingClientRect();
  const positions = [
    { left: 0, top: 4 },
    { left: maxLeft, top: 4 },
    { left: 0, top: maxTop },
    { left: maxLeft, top: maxTop },
    { left: Math.round(maxLeft / 2), top: maxTop }
  ];
  const safePositions = positions.filter(({ left, top }) => {
    const overlapsYes = left < yesBounds.right - actionBounds.left
      && left + proposalNo.offsetWidth > yesBounds.left - actionBounds.left
      && top < yesBounds.bottom - actionBounds.top
      && top + proposalNo.offsetHeight > yesBounds.top - actionBounds.top;
    const pointerNear = event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)
      && event.clientX >= actionBounds.left + left - 24
      && event.clientX <= actionBounds.left + left + proposalNo.offsetWidth + 24
      && event.clientY >= actionBounds.top + top - 24
      && event.clientY <= actionBounds.top + top + proposalNo.offsetHeight + 24;
    return !overlapsYes && !pointerNear;
  });
  const choices = safePositions.length ? safePositions : positions;
  const position = choices[Math.floor(Math.random() * choices.length)];
  proposalNo.style.position = 'absolute';
  proposalNo.style.left = `${position.left}px`;
  proposalNo.style.top = `${position.top}px`;
}

proposalNo.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') moveNoButton(event);
});
proposalNo.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse') {
    event.preventDefault();
    moveNoButton(event);
  }
});
proposalNo.addEventListener('click', (event) => {
  event.preventDefault();
  moveNoButton(event);
});
proposalNo.addEventListener('focus', () => moveNoButton());
proposalYes.addEventListener('click', async () => {
  proposalResponse.textContent = siteConfig.proposal.yesMessage;
  proposalResponse.hidden = false;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const proposalSection = document.querySelector('#proposal');
    const heartPositions = [5, 14, 23, 77, 86, 95];
    heartPositions.forEach((position) => {
      const heart = document.createElement('span');
      const delay = Math.random() * 0.5;
      const duration = 2.4 + Math.random() * 0.8;
      heart.className = 'proposal-heart';
      heart.setAttribute('aria-hidden', 'true');
      heart.textContent = '♥';
      heart.style.setProperty('--heart-left', `${position}%`);
      heart.style.setProperty('--heart-delay', `${delay}s`);
      heart.style.setProperty('--heart-duration', `${duration}s`);
      heart.style.setProperty('--heart-size', `${9 + Math.random() * 7}px`);
      proposalSection.append(heart);
      window.setTimeout(() => heart.remove(), (duration + delay) * 1000 + 100);
    });
  }

  if (proposalEmailSent || proposalEmailSending) return;
  proposalEmailSending = true;
  proposalYes.disabled = true;
  proposalEmailStatus.hidden = false;
  proposalEmailStatus.textContent = 'Sending your yes to my email...';

  const emailData = new FormData();
  emailData.append('access_key', siteConfig.proposal.emailAccessKey);
  emailData.append('subject', `${siteConfig.name} said yes!`);
  emailData.append('from_name', siteConfig.name);
  emailData.append('message', `${siteConfig.name} clicked Yes on your proposal. This is the beginning of your next chapter together.`);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: emailData
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'The email could not be sent.');
    }
    proposalEmailSent = true;
    proposalEmailStatus.textContent = 'Your yes has reached my email. Thank you for making my day.';
  } catch (error) {
    proposalEmailSending = false;
    proposalYes.disabled = false;
    proposalEmailStatus.textContent = error.message || 'The email could not be sent. Please try again.';
  }
});

