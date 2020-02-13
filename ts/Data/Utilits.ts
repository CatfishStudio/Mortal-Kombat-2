module Utilits {
    export class Data {

        /* Debug отладка */
        public static debugLog(title:string, value: any):void {
            if(Config.buildDev) console.log(title, value);
        }

        /* Проверка четности и нечетности */
        public static checkEvenOrOdd(n: number): boolean {
            if (n & 1) {
                return false; // odd (нечетное число)
            } else {
                return true; // even (четное число)
            }
        }

        /* Генератор случайных чисел */
        public static getRandomIndex(): number {
            let index: number = Math.round(Math.random() / 0.1);
            return index;
        }

        /* Генератор случайных чисел из диапазона чисел мин/макс */
        public static getRandomRangeIndex(min: number, max: number):number {
            max -= min;
            let index: number = (Math.random() * ++max) + min;
            return  Math.floor(index);
        }

        /* Функция перемешивает элементы массива */
        public static compareRandom(a, b) {
            return Math.random() - 0.5;
        }
    }
}