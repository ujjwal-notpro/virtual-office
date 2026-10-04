export const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Krishna',
    role: 'Product Lead',
    avatar: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    status: 'online', unread: 2, time: '11:42 AM',
    messages: [
      { id: 1, sender: 'them', text: 'Hey Ujjwal! Have you checked the latest sprint update?', time: '11:30 AM' },
      { id: 2, sender: 'them', text: 'Here is the quarterly project roadmap documentation for your review.', time: '11:32 AM', attachment: { name: 'Q4_Workspace_Roadmap.pdf', size: '2.4 MB', ext: 'PDF', type: 'document' } },
      { id: 3, sender: 'me', text: 'Yes, looking through the notes right now. Looks solid!', time: '11:38 AM' },
      { id: 4, sender: 'them', text: 'Awesome! Let me know if we need any quick adjustments.', time: '11:42 AM' },
    ],
  },
  {
    id: 2, name: 'yashraj', role: 'Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    status: 'online', unread: 0, time: '10:15 AM',
    messages: [{ id: 1, sender: 'them', text: 'The new API endpoints are deployed to staging.', time: '10:10 AM' }, { id: 2, sender: 'me', text: 'Great, I will test the integration shortly.', time: '10:15 AM' }],
  },
  {
    id: 3, name: 'DevOps & Infrastructure', role: 'Group - 8 members',
    avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
    status: 'offline', unread: 0, time: 'Yesterday',
    messages: [{ id: 1, sender: 'them', text: 'Scheduled database maintenance completed with 0 downtime.', time: 'Yesterday' }],
  },
  {
    id: 4, name: 'Wanda', role: 'UI/UX Designer',
    avatar: 'https://plus.unsplash.com/premium_photo-1689564003745-946f35267ffe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHByb2ZpbGUlMjBwaG90byUyMG9mJTIwd29tZW58ZW58MHx8MHx8fDA%3D',
    status: 'away', unread: 0, time: 'Oct 02',
    messages: [{ id: 1, sender: 'them', text: 'Shared the new design prototypes in Figma.', time: 'Oct 02' }],
  },
];
