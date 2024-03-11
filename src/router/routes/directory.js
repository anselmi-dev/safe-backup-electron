import DirectoryForm from '../../components/DirectoryForm.vue';

export default [
  {
    path: '/directory/:id?',
    name: 'directory',
    component: DirectoryForm,
    props: true,
    meta: {
      displaySidebar: true,
    },
  },
];