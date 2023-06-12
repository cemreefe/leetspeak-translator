// ==UserScript==
// @name         Leetspeak Translator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Translates every website to Leetspeak (in all caps).
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function translateToLeet(text) {
        const leetMap = {
            'A': '4',
            'E': '3',
            'I': '1',
            'O': '0',
            'S': '5',
            'T': '7',
            'L': '1',
            'G': '9',
            'B': '8',
            'Z': '2'
        };
        let translatedText = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i].toUpperCase();
            if (leetMap.hasOwnProperty(char)) {
                translatedText += leetMap[char];
            } else {
                translatedText += char;
            }
        }

        return translatedText;
    }

    function translateNodeContent(node) {
        const childNodes = Array.from(node.childNodes);

        childNodes.forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE && !isInsideCodeBlock(childNode)) {
                const translatedText = translateToLeet(childNode.textContent);
                childNode.textContent = translatedText;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                translateNodeContent(childNode);
            }
        });
    }

    function isInsideCodeBlock(node) {
        let currentNode = node.parentNode;

        while (currentNode !== null) {
            if (currentNode.tagName === 'CODE') {
                return true;
            }

            currentNode = currentNode.parentNode;
        }

        return false;
    }

    function handleMutation(mutationsList) {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    translateNodeContent(node);
                }
            });
        });
    }

    function translatePageToLeet() {
        translateNodeContent(document.body);

        const observer = new MutationObserver(handleMutation);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    translatePageToLeet();
})();
