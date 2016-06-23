angular.module('ngPlugin', [])
    .provider('alert', function () {
        var alertElement,confirmElement,timer;
        return {
            $get: ['$timeout', '$compile', '$rootScope', function ($timeout, $compile, $rootScope) {
                return {
                    alert: function (options) {
                        var defaultOptions = {
                            reason: '此提示3秒后关闭',
                            message: '保存编辑失败，出现了错误哦！',
                            type: 'fail',
                            delay: '3'
                        };
                        var opts = angular.extend({}, defaultOptions, options);
                        var scope = $rootScope.$new(true);

                        if(alertElement){
                            alertElement.remove();
                            clearTimeout(timer);
                        }

                        var render = function(){
                            var template = '<div class="alertmsg"><div><div class="alertmsg_title">' +
                                opts.message + '</div><div class="alertmsg_detailed">' +
                                opts.reason + '</div></div><div><button ng-click="close($event)" class="alertmsg_close">' +
                                '关闭</button></div></div>';

                            alertElement = $compile(template)(scope);
                            // scope.alertElement = alertElement;
                            angular.element('body').append(alertElement);

                            if (opts.type == 'success') {
                                alertElement.css('backgroundColor', '#43a047');
                            }
                            timer = setTimeout(scope.close,opts.delay*1000);
                        };

                        scope.close = function (event) {
                            alertElement.animate({top: '-88'}, 500, function () {
                                alertElement.remove();
                                clearTimeout(timer);
                            });
                            scope.$destroy();
                        };

                        return render();
                    },
                    confirm: function(options){
                        var defaultOptions = {
                            title : '确认删除？',
                            detailed : '该操作是不可逆的，是否仍然继续？',
                            no : '取  消',
                            yes : '确认删除',
                            delay : '3',
                            confirm : function(){},
                            cancel : function(){}
                        };
                        var opts = angular.extend({}, defaultOptions, options);
                        var scope = $rootScope.$new(true);

                        var removeConfirm = function(){
                            confirmElement.animate({bottom:'-64'}, opts.delay*100,function(){
                                confirmElement.remove();
                                confirmElement = null;
                            });
                        }

                        if(confirmElement){
                            confirmElement.remove();
                            opts.cancel();
                        }

                        var render = function(){
                            var template = '<div class="msgbox" style="bottom:-64px"><div><div class="msg_title">'+
                                opts.title+'</div><div class="msg_detailed">'+
                                opts.detailed+'</div></div><div><button ng-click="no($event)" class="msg_no">'+
                                opts.no+'</button><button ng-click="yes($event)" class="msg_yes">'+
                                opts.yes+'</button></div></div>';

                            confirmElement = $compile(template)(scope);
                            angular.element('body').append(confirmElement);
                            confirmElement.animate({bottom:'0'}, opts.delay*100);
                        }

                        scope.yes = function(){
                            opts.confirm();
                            removeConfirm();
                        }

                        scope.no = function(){
                            opts.cancel();
                            removeConfirm();
                        }

                        return render();
                    }
                }
            }]
        }
    })
    .directive('ngValidate', ['$compile', function ($compile) {
        return {
            restrict: 'AC',
            scope: {
                vdRequired: '@vdRequired',
                vdRequiredMsg: '@vdRequiredMsg',
                vdMobile: '@vdMobile',
                vdMobileMsg: '@vdMobileMsg',
                vdEmail: '@vdEmail',
                vdEmailMsg: '@vdEmailMsg',
                vdMin: '@vdMin',
                vdMinMsg: '@vdMinMsg',
                vdMax: '@vdMax',
                vdMaxMsg: '@vdMaxMsg',
                vdMinlength: '@vdMinlength',
                vdMinlengthMsg: '@vdMinlengthMsg',
                vdMaxlength: '@vdMaxlength',
                vdMaxlengthMsg: '@vdMaxlengthMsg',
                vdPattern: '@vdPattern',
                vdPatternMsg: '@vdPatternMsg',
                placement: '@placement',
                trigger: '@trigger',
                show: '@show'
            },
            require: '?ngModel',
            transclude: true,
            template: '<input ng-transclude ng-class="{error:$parent[fname][vname].$invalid && $parent[fname][vname].$dirty}"/>',
            replace: true,
            link: function (scope, ele, attr, ngModelCtrl) {
                if (!ngModelCtrl) return;
                var Vname = scope.$parent.$eval(attr.dyName) || attr.dyName || attr.name;
                scope.vname = scope.$parent.$eval(attr.dyName) || attr.dyName || attr.name;
                scope.fname = angular.element(ele).parents('form').attr('name');
                scope.inputName = scope.$eval(attr.name);
                scope.validateMsgArray = [];
                var validateArray = [];
                scope.validate = '';
                var template = '<div class="tooltips-wrap"><div class="tooltips" ng-class="{valid:validate}"><i class="arrow"></i><i class="arrow in"></i><ul>'
                    + '<li class="tip" ng-repeat="tip in validateMsgArray track by $index" ng-cloak="" ng-class="{valid:tip.status}" ng-bind="tip.msg">{{tip.msg}}</li>'
                    + '</ul></div></div>';
                var defaultOptions = {
                    placement: 'right',
                    trigger: 'focus',
                    show: 'false'
                };
                var triggerMap = {
                    'mouseenter': 'mouseleave',
                    'focus': 'blur',
                    'click': 'click'
                };
                // console.log(attr);
                function getOptions() {
                    var options = {};
                    if (attr['placement']) {
                        options.placement = attr['placement'];
                    }
                    if (attr['trigger']) {
                        options.trigger = attr['trigger'];
                    }
                    if (attr['show']) {
                        options.show = attr['show'];
                    }
                    return options;
                }

                var options = angular.extend({}, defaultOptions, getOptions());
                // console.log(options);
                for (var p in attr) {
                    if (/^vd/.test(p) && !/^vd[a-zA-Z]+Msg$/.test(p) && scope[p]) {
                        validateArray.push(p);
                    }
                }
                var validators = {
                    required: function (required, viewValue) {
                        return required == 'true' && !ngModelCtrl.$isEmpty(viewValue);
                    },
                    min: function (minValue, viewValue) {
                        return ngModelCtrl.$isEmpty(viewValue) || !isNaN(minValue) && !isNaN(viewValue) && parseInt(viewValue) >= parseInt(minValue);
                    },
                    max: function (maxValue, viewValue) {
                        return ngModelCtrl.$isEmpty(viewValue) || !isNaN(maxValue) && !isNaN(viewValue) && parseInt(viewValue) <= parseInt(maxValue);
                    },
                    mobile: function (tel, viewValue) {
                        return ngModelCtrl.$isEmpty(viewValue) || tel == 'true' && /^0?(1[3,4,5,7,8])\d{9}$/.test(viewValue);
                    },
                    email: function (email, viewValue) {
                        return ngModelCtrl.$isEmpty(viewValue) || email == 'true' && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(viewValue);
                    },
                    minlength: function (minlength, viewValue) {
                        return 0 > minlength || (!ngModelCtrl.$isEmpty(viewValue) && viewValue.length >= parseInt(minlength));
                    },
                    maxlength: function (maxlength, viewValue) {
                        return 0 > maxlength || ngModelCtrl.$isEmpty(viewValue) || viewValue.length <= parseInt(maxlength);
                    },
                    pattern: function (pattern, viewValue) {
                        return !ngModelCtrl.$isEmpty(viewValue) || pattern.test(viewValue);
                    }
                };

                function validate(value, inputname, scope) {
                    var count = '';
                    scope.validateMsgArray = [];
                    angular.forEach(validateArray, function (v, index) {
                        var method = v.replace(/^vd/, "").toLowerCase();
                        if (validators[method](scope[v], value)) {
                            scope[v + 'Msg'].trim() == '' ? false : scope.validateMsgArray.push({
                                status: true,
                                msg: scope[v + 'Msg']
                            });
                            ngModelCtrl.$setValidity(method+'_validated', true);
                            count++;
                        } else {
                            scope[v + 'Msg'].trim() == '' ? false : scope.validateMsgArray.push({
                                status: false,
                                msg: scope[v + 'Msg']
                            });
                            ngModelCtrl.$setValidity(method+'_validated', false);
                        }
                    });
                    scope.validate = count == validateArray.length;
                }

                ngModelCtrl.$parsers.unshift(function (value) {
                    validate(value, scope.inputName, scope);
                    return value;
                });
                ngModelCtrl.$formatters.push(function (value) {
                    validate(value, scope.inputName, scope);
                    return value;
                });
                ele.focusin(function (event) {
                    ngModelCtrl.$dirty = true;
                    ngModelCtrl.$pristine = false;
                });
                function setPosition(tooltip) {
                    var elePosition = angular.element(ele).offset();
                    angular.element(tooltip).css({
                        top: elePosition.top + 'px',
                        left: elePosition.left + angular.element(ele).outerWidth() + 5 + 'px'
                    });
                }

                var tooltip;
                ele.on(options.trigger, function (event) {
                    if (!tooltip) {
                        validate(ele.val(), scope.inputName, scope);
                        tooltip = $compile(template)(scope, function (tooltip) {
                            tooltip.appendTo('body');
                        });
                        setPosition(tooltip);
                        scope.$apply();
                    }
                });
                ele.on(triggerMap[options.trigger], function () {
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });
            }
        }
    }])