import {
  AppleShortcuts,
  AppleShortcutsSolid,
  AppNotificationSolid,
  Calendar,
  ColorWheel,
  CompassSolid,
  CoolingSquareSolid,
  DocMagnifyingGlass,
  DownloadSquareSolid,
  FlashSolid,
  GoogleDocs,
  GraduationCapSolid,
  HeartSolid,
  Journal,
  GraduationCap,
  MediaImage,
  MultiBubbleSolid,
  PocketSolid,
  Settings,
  TextSquareSolid,
  User,
  WhiteFlagSolid,
} from 'iconoir-react';

export const NAV_SECTION_LABELS = {
  overview: 'Overview',
  templates: 'Templates',
  content: 'Content',
  utilities: 'Utilities',
  learn: 'Learning',
  settings: 'Settings',
};

export const getAdminNavSections = (baseurl, mdaType) => {
  const utilities =
    mdaType === 'full'
      ? [
          {
            name: 'Services',
            href: `${baseurl}/services`,
            icon: <AppNotificationSolid />,
            id: 'services-admin',
          },
          {
            name: 'Form Builder',
            href: `${baseurl}/forms`,
            icon: <GoogleDocs />,
            id: 'forms-admin',
          },
          {
            name: 'Subscribers',
            href: `${baseurl}/subscribers`,
            icon: <HeartSolid />,
            id: 'subscribers-admin',
          },
        ]
      : [
          {
            name: 'Services',
            href: `${baseurl}/services`,
            icon: <AppNotificationSolid />,
            id: 'services-admin',
          },
          {
            name: 'Form Builder',
            href: `${baseurl}/forms`,
            icon: <GoogleDocs />,
            id: 'forms-admin',
          },
        ];

  const learn = [
    {
      name: 'Learning',
      href: `${baseurl}/learn`,
      icon: <GraduationCap />,
      id: 'learn-admin',
    },
  ];

  const settings = [
    {
      name: 'General Settings',
      href: `${baseurl}/settings`,
      icon: <Settings />,
      id: 'settings-admin',
    },
  ];

  if (mdaType !== 'full') {
    return { utilities, learn, settings };
  }

  return {
    overview: [
      {
        name: 'Dashboard',
        href: `${baseurl}/dashboard`,
        icon: <AppleShortcutsSolid />,
        id: 'dashboard-admin',
      },
    ],
    templates: [
      {
        name: 'Published',
        href: `${baseurl}/published`,
        icon: <FlashSolid />,
        id: 'published-admin',
      },
      {
        name: 'Drafts',
        href: `${baseurl}/drafts`,
        icon: <WhiteFlagSolid />,
        id: 'drafts-admin',
      },
      {
        name: 'Themes',
        href: `${baseurl}/themes`,
        icon: <ColorWheel />,
        id: 'themes-admin',
      },
      {
        name: 'Library',
        href: `${baseurl}/library`,
        icon: <PocketSolid />,
        id: 'library-admin',
      },
    ],
    content: [
      {
        name: 'About, Vision & Mission',
        href: `${baseurl}/vision`,
        icon: <CompassSolid />,
        id: 'vision-admin',
      },
      {
        name: 'Agencies / Depts.',
        href: `${baseurl}/agencies`,
        icon: <CoolingSquareSolid />,
        id: 'agencies-admin',
      },
      {
        name: 'Principal Officers',
        href: `${baseurl}/people`,
        icon: <GraduationCapSolid />,
        id: 'people-admin',
      },
      {
        name: 'Responsibilities',
        href: `${baseurl}/responsibility`,
        icon: <TextSquareSolid />,
        id: 'responsibility-admin',
      },
      {
        name: 'Newsroom',
        href: `${baseurl}/newsroom`,
        icon: <Journal />,
        id: 'newsroom-admin',
      },
      {
        name: 'Events',
        href: `${baseurl}/events`,
        icon: <Calendar />,
        id: 'events-admin',
      },
      {
        name: 'Gallery',
        href: `${baseurl}/gallery`,
        icon: <MediaImage />,
        id: 'gallery-admin',
      },
      {
        name: 'Resources',
        href: `${baseurl}/resources`,
        icon: <DownloadSquareSolid />,
        id: 'resources-admin',
      },
      {
        name: 'Contact',
        href: `${baseurl}/contact`,
        icon: <MultiBubbleSolid />,
        id: 'contact-admin',
      },
    ],
    utilities,
    learn,
    settings,
  };
};

export const getCommsNavLinks = (baseurl) => [
  {
    name: 'Learning',
    href: `${baseurl}/learn`,
    icon: <GraduationCap />,
    id: 'learn-admin',
  },
  {
    name: 'Resources',
    href: `${baseurl}/resources`,
    icon: <DocMagnifyingGlass />,
    id: 'resources-admin',
  },
  {
    name: 'People',
    href: `${baseurl}/people`,
    icon: <User />,
    id: 'people-admin',
  },
  {
    name: 'Contact',
    href: `${baseurl}/contact`,
    icon: <AppleShortcuts />,
    id: 'contact-admin',
  },
];
