/*
 * jQuery JavaScript Library plugin v.1.0
 * Copyright 2015, Sergey Kochetkov
 * MIT License
 */

(function ($) {

    var C_PLUGIN_NAME = 'emclock';

    var defaultOptions = {
        now: 'Unix timestamp'
    };


    function EmDateTime(d) {
        this._date;
        this.init(d);
    }


    EmDateTime.calcTimesDiff = function (dt2) {
        var res = 0, dt1 = new Date();
        if (typeof dt2 !== 'undefined') {
            if (Object.prototype.toString.call(dt2) === '[object Date]') {
                var t1 = dt1.getTime(), t2 = dt2.getTime();
                if (isNaN(t2) === false) {
                    res = t2 - t1;
                }
            }
        }

        return res;
    };

    EmDateTime.prototype = {
        // change these according your locale
        _daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        _monthsInSentence: [
            'января', 'февраля', 'марта', 'апреля',
            'мая', 'июня', 'июля', 'августа',
            'сентября', 'октября', 'ноября', 'декабря'
        ],
        init: function (d) {
            this._date = new Date();

            return  this.set(d);

        },
        set: function (d) {
            if (typeof d !== 'undefined') {
                if (Object.prototype.toString.call(d) === '[object Date]') {
                    // Date
                    this._date = d;
                    return this;
                } else {
                    if (isNaN(d) === false) {
                        // number
                        this._date = new Date(parseInt(d));
                        return this;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        },
        /**
         * Exrtacts time digits from referenced Date object
         * @param {Date} d
         * @returns {Object} year, month, date, hh, mm, ss, dayText
         */
        toTextObject: function () {
            var d = this._date;
            var res = {
                year: '',
                month: '',
                date: '',
                hh: '',
                mm: '',
                ss: '',
                dayText: '',
                monthText: ''
            };

            if (Object.prototype.toString.call(d) === '[object Date]') {
                res.year = d.getFullYear().toString();

                res.month = (1 + d.getMonth()).toString();
                res.month = res.month.length > 1 ? res.month : '0' + res.month;

                res.date = (1 + d.getDate()).toString();
                res.date = res.date.length > 1 ? res.date : '0' + res.date;

                res.hh = d.getHours().toString();
                res.hh = res.hh.length > 1 ? res.hh : '0' + res.hh;

                res.mm = d.getMinutes().toString();
                res.mm = res.mm.length > 1 ? res.mm : '0' + res.mm;

                res.ss = d.getSeconds().toString();
                res.ss = res.ss.length > 1 ? res.ss : '0' + res.ss;

                res.dayText = this._daysOfWeek[d.getDay()];

                res.monthText = this._monthsInSentence[d.getMonth()];
            }

            return res;
        }
    };


    var methods = {
        init: function (options) {
            var
                    settings = $.extend({}, defaultOptions, options),
                    self = this,
                    $this = $(this),
                    data = $this.data[C_PLUGIN_NAME],
                    isInitialised = !!data;
            if (isNaN(settings.now)) {
                settings.now = new Date().getTime();
            }
            if (isInitialised === false) {
                // если не проинициализирован
                // вычислить разницу во времени между системным new Date() и серверным
                // рендер
                // запустить рендер по таймеру

                data = {
                    timeDiff: EmDateTime.calcTimesDiff(new Date(settings.now))
                };

                data.intervalId = setInterval(function () {
                    methods.tick.apply(self);
                }, 1000);

                $this.data[C_PLUGIN_NAME] = data;

            }
        },
        tick: function () {
            var
                    $this = $(this),
                    data = $this.data[C_PLUGIN_NAME],
                    curEmDTime = new EmDateTime(new Date().getTime() + data.timeDiff),
                    timeTextObj = curEmDTime.toTextObject(),
                    html = methods.createHtml(timeTextObj)
                    ;
            $this.html(html);
        },
        createHtml: function (digits) {
            var
                    datetime =
                    ' datetime="'
                    + digits.year + '-'
                    + digits.month + '-'
                    + digits.date + ' '
                    + digits.hh + ':'
                    + digits.mm + ':'
                    + digits.ss
                    + '"'
                    ,
                    res =
                    '<time '
                    + datetime
                    + '>'
                    + digits.hh + ':'
                    + digits.mm + ':'
                    + digits.ss
                    + '</time>'
                    ;
            res +=
                    '<time '
                    + datetime
                    + '>'
                    + digits.dayText + '. ' + digits.date + ' ' + digits.monthText
                    + '</time>';

            return res;

        }

    };

    $.fn[C_PLUGIN_NAME] = function (method) {
        // Если первый агрумент - имя метода
        if (methods[method]) {
            // вызываем метод и передаем все оставшиеся аргументы
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            // Если первый аргумент - объект, значит это опции
            // Если аргументов нет - значит вызов с дефолтными настройками
            if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Метод с именем ' + method + ' не существует для jQuery.' + C_PLUGIN_NAME);
            }

        }
    };


}(jQuery));
