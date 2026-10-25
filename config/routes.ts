export default [
  { path: '/user/login', layout: false, component: './social/login' },
  {
    path: '/moderation',
    name: 'moderation',
    icon: 'audit',
    access: 'canAdmin',
    component: './social/moderation',
  },
  {
    path: '/users',
    name: 'users',
    icon: 'user',
    access: 'canAdmin',
    component: './social/users',
  },
  {
    path: '/audit',
    name: 'audit',
    icon: 'history',
    access: 'canAdmin',
    component: './social/audit',
  },
  { path: '/', redirect: '/moderation' },
  { path: '/*', component: './exception/404' },
];
