<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Leif Nervick | Web Develoer Portfolio</title>
        <meta name="description" content="">
        
        <link rel="icon" href="{{ asset('favicon.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">
        
        <link rel="canonical" href="https://leifnervick.com/">

        <!-- Fonts -->
        <link rel="dns-prefetch" href="//fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&family=Alegreya&family=Nunito+Sans:opsz@6..12" rel="stylesheet">
        
        <script type="text/javascript">
            // Global ROUTE DATA
            const routeData = <?php echo json_encode($routes); ?>;
        </script>

        @viteReactRefresh
        @vite('resources/app.jsx')

        <!-- Styles -->

        <noscript>This site requires JavaScript to be enabled. Please enable JavaScript and try again</noscript>

    </head>
    <body>
        <div id="app" ></div>
    </body>
</html>
