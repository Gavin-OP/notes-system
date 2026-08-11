# Career Run image assets

The Career Run uses the shared job-seeker character on its introduction. Event cards use accessible HTML text, category colors, and CSS surfaces rather than bitmap backgrounds.

```text
public/assets/career-run/
├── jobseeker.png                     1024 × 1536
├── events/
│   ├── profile.png
│   ├── application.png
│   ├── networking.png
│   ├── interview.png
│   └── offer.png
├── endings/                          optional future assets
└── personas/                         optional future assets
```

The category images in `events/` are retained as source assets but are not currently rendered. If they are restored later, essential Event information must remain accessible HTML rather than text embedded only inside the bitmap.
