< !DOCTYPE html >
    <html class="light" lang="en"><head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>E-commerce Hero Section</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;display=swap" rel="stylesheet" />
        <script>
            tailwind.config = {
                darkMode: "class",
            theme: {
                extend: {
                colors: {
                "primary": "#1773cf",
            "background-light": "#f6f7f8",
            "background-dark": "#111921",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
            },
            keyframes: {
                slide: {
                '0%, 100%': {
                transform: 'translateX(0%)'
                },
            '25%': {
                transform: 'translateX(0%)'
                },
            '33%': {
                transform: 'translateX(-100%)'
                },
            '58%': {
                transform: 'translateX(-100%)'
                },
            '66%': {
                transform: 'translateX(-200%)'
                },
            '91%': {
                transform: 'translateX(-200%)'
                },
              }
            },
            animation: {
                slide: 'slide 15s infinite ease-in-out',
            }
          },
        },
      }
        </script>
        <style>
            .material-symbols-outlined {
                font - variation - settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
        </style>
        <style>
            body {
                min - height: max(884px, 100dvh);
      }
        </style>
        <style>
            body {
                min - height: max(884px, 100dvh);
    }
        </style>
    </head>
        <body class="bg-background-light dark:bg-background-dark font-display">
    
            <main>
                <div class="relative h-screen w-full overflow-hidden">
                    <div class="absolute inset-0 w-full h-full flex animate-slide z-0">
                        <div class="w-full h-full flex-shrink-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 31, 63, 0.5) 0%, rgba(0, 31, 63, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6iyDF3_qKn6lAt8vISEAg-w12vHkhW8EvlpudOJi8WSS03bLThcPSG_NVDScdUnATyO2aALT5yo-tnALUXiAm9oKKi_PWEgKUP7u4N3e5JohuTKpwtjKYMVjRSZAu3I19eeqBFVz6P86-qEfuoB2dlg7vSuekiRV__NScC8Qv5IrSj21I8txcHo3ZtV-ikeKQzhFlu6yqjB4u135NG9_VdwxnKpcy7nYdFl_oBTXch9EqtmJDXdUXEjYSdPRu1_PsrnIW4cCU_xqy");'></div>
                        <div class="w-full h-full flex-shrink-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 31, 63, 0.5) 0%, rgba(0, 31, 63, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7PxKeqs0ri3v4xWiegIlIPvJIHGQ4UMTkWosZQQQTrQNZ9pj96fbyANFay1Gj0tlfDzA4WzOxbhq6RtgV6iAw4o_ncoHjfqZUwEFT879jPMBbLl11OFuQXUxbgeDn9mjuIpofhA68ko3BwWyQqIpdCKchJl24hED-n32EHG5EBocfrKbka1scFaTCVGUrVtWClw0FtOFwKQUHPTVSvGDA1F3en44cu9SaKTOMJS8MMMSPnQ1kL8ucUKIhnqaCNwxp4Zk5ImIxIqIg");'></div>
                        <div class="w-full h-full flex-shrink-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 31, 63, 0.5) 0%, rgba(0, 31, 63, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7PxKeqs0ri3v4xWiegIlIPvJIHGQ4UMTkWosZQQQTrQNZ9pj96fbyANFay1Gj0tlfDzA4WzOxbhq6RtgV6iAw4o_ncoHjfqZUwEFT879jPMBbLl11OFuQXUxbgeDn9mjuIpofhA68ko3BwWyQqIpdCKchJl24hED-n32EHG5EBocfrKbka1scFaTCVGUrVtWClw0FtOFwKQUHPTVSvGDA1F3en44cu9SaKTOMJS8MMMSPnQ1kL8ucUKIhnqaCNwxp4Zk5ImIxIqIg");'></div>
                    </div>
                    <div class="relative z-10 flex h-full flex-col items-center justify-center p-4">
                        <div class="flex flex-col gap-4 text-center max-w-3xl">
                            <h1 class="text-white text-5xl font-black leading-tight tracking-tighter md:text-7xl">
                                Quality for Every Home
                            </h1>
                            <h2 class="text-white/90 text-lg font-normal leading-normal md:text-xl">
                                Explore our curated collection of clothing, kitchen tools, home décor, electrical appliances, and more. Find everything you need to elevate your lifestyle.
                            </h2>
                        </div>

                    </div>
                </div>
            </main>

        </body></html>