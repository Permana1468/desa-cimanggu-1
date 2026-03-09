const fs = require('fs');
const filepath = 'c:/laragon/www/desa_cimanggu_1/frontend/src/pages/LandingPage.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const replacements = [
    ['flex flex - col items - center justify - center p - 4 rounded - 2xl', 'flex flex-col items-center justify-center p-4 rounded-2xl'],
    ['w - 44 md: w - 56 text - center z - 10 hover: -translate - y - 1 transition - transform', 'w-44 md:w-56 text-center z-10 hover:-translate-y-1 transition-transform'],
    ['w - 12 h - 12 rounded - full mb - 3 flex items - center justify - center', 'w-12 h-12 rounded-full mb-3 flex items-center justify-center'],
    ['font - bold text - sm md: text - base', 'font-bold text-sm md:text-base'],
    ['mb - 1 line - clamp - 1', 'mb-1 line-clamp-1'],
    ['fixed top - 0 w - full z - 50 transition - all duration - 300', 'fixed top-0 w-full z-50 transition-all duration-300'],
    ['relative z - 10 px - 5 py - 2 text - [14px] font - medium transition - colors duration - 300', 'relative z-10 px-5 py-2 text-[14px] font-medium transition-colors duration-300'],
    ['md:hidden absolute top - full left - 0 w - full bg - [#0f172a] / 95 backdrop - blur - xl border - t border - white / 10 transition - all duration - 300 overflow - hidden', 'md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden'],
    ['text - [15px] font - medium transition - colors', 'text-[15px] font-medium transition-colors'],
    ['absolute inset - 0 transition - opacity duration - [2000ms] ease -in -out', 'absolute inset-0 transition-opacity duration-[2000ms] ease-in-out'],
    ['w - full h - full bg - cover bg - center transition - transform duration - [15000ms] ease - out', 'w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out'],
    ['h - 1.5 rounded - full transition - all duration - 500 ease -in -out', 'h-1.5 rounded-full transition-all duration-500 ease-in-out'],
    ['#${menu.id} ', '#${menu.id}'],
    ['Slide ${index + 1} ', 'Slide ${index + 1}'],
    ['style={{ transform: `translateX(${translateX} %) rotateY(${rotateY}deg)`', 'style={{ transform: `translateX(${translateX}%) rotateY(${rotateY}deg)`'],
    ['transition - all duration - 500 ease - out cursor - pointer', 'transition-all duration-500 ease-out cursor-pointer'],
    ['w - 64 md: w - 80 h - 96 rounded - 2xl overflow - hidden shadow - 2xl', 'w-64 md:w-80 h-96 rounded-2xl overflow-hidden shadow-2xl'],
    ['flex flex - col', 'flex flex-col'],
    ['font - bold text - lg leading - snug line - clamp - 3', 'font-bold text-lg leading-snug line-clamp-3']
];

let replaced = content;
for (const [find, replace] of replacements) {
    // Replace all occurrences
    replaced = replaced.split(find).join(replace);
}

fs.writeFileSync(filepath, replaced);
console.log('ClassNames fixed!');
