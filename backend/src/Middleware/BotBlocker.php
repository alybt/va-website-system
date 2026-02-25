<?php
namespace App\Middleware;

class BotBlocker {
    public static function handle() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
 
        $blockedBots = [
            'Baiduspider', 'Sogou', 'Exabot', 'ia_archiver', 
            'curl', 'python-requests', 'PostmanRuntime'
        ];         

        foreach ($blockedBots as $bot) {
            if (stripos($userAgent, $bot) !== false) {
                http_response_code(403);
                die(json_encode(["error" => "Access denied for bots."]));
            }
        }

        $aiBots = [
            'Bytespider', 
            'GPTBot', 
            'ClaudeBot', 
            'ImagesiftBot', 
            'CCBot', 
            'ChatGPT-User', 
            'omgili', 
            'Diffbot', 
            'Claude-Web', 
            'PerplexityBot'
        ];

        foreach ($aiBots as $bot) {
            if (stripos($userAgent, $bot) !== false) { 
                
                http_response_code(403); 
                header('Content-Type: application/json');
                die(json_encode([
                    "error" => "Access denied",
                    "message" => "AI Crawlers are not permitted on this resource."
                ]));
            }
        }

    }
}