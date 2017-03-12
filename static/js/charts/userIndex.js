﻿(function ($) {
    $.learuntab = {
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id');
            var target = $('.LRADMS_iframe[data-id="' + currentId + '"]');
            var url = target.attr('src');
            //$.loading(true);
            target.attr('src', url).load(function () {
                //$.loading(false);
            });
        },
        activeTab: function () {
            var currentId = $(this).data('id');
            if (!$(this).hasClass('active')) {
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.learuntab.scrollToTab(this);
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-remove').parents('a').not(".active").each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        addTab: function () {
            $(".navbar-custom-menu>ul>li.open").removeClass("open");
            var dataId = $(this).attr('data-id');
            if (dataId != "") {
                //top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href');
            var menuName = $.trim($(this).text());
            var flag = true;
            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.learuntab.scrollToTab(this);
                        $('.mainContent .LRADMS_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.LRADMS_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-remove"></i></a>';
                $('.menuTab').removeClass('active');
                var str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('.mainContent').find('iframe.LRADMS_iframe').hide();
                $('.mainContent').append(str1);
                //$.loading(true);
                $('.mainContent iframe:visible').load(function () {
                    //$.loading(false);
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        scrollTabRight: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.learuntab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            var marginLeftVal = $.learuntab.calSumWidth($(element).prevAll()), marginRightVal = $.learuntab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            var width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        init: function () {
            $('.menuItem').on('click', $.learuntab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.learuntab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.learuntab.activeTab);
            $('.tabLeft').on('click', $.learuntab.scrollTabLeft);
            $('.tabRight').on('click', $.learuntab.scrollTabRight);
            $('.tabReload').on('click', $.learuntab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger("click");
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.fa-remove').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
                $('.page-tabs-content').css("margin-left", "0");
            });
            $('.tabCloseOther').on('click', $.learuntab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.learuntab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen');
                    $.learuntab.exitFullscreen();
                }
            });
        }
    };
    $.learunindex = {
        load: function () {
            $("body").removeClass("hold-transition");
            $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            $(window).resize(function (e) {
                $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            });
            $(".sidebar-toggle").click(function () {
                if (!$("body").hasClass("sidebar-collapse")) {
                    $("body").addClass("sidebar-collapse");
                } else {
                    $("body").removeClass("sidebar-collapse");
                }
            });
            $(window).load(function () {
                window.setTimeout(function () {
                    $('#ajax-loader').fadeOut();
                }, 300);
            });
        },
        jsonWhere: function (data, action) {
            if (action == null) return;
            var reval = new Array();
            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            });
            return reval;
        },/*
        		F_ModuleId父列表      F_ParentId= F_ModuleId  属于的子列表
          */
        loadMenu: function () {
			            var data = [
                            {
                                "F_ModuleId" : "3",
                                "F_ParentId" : "0",
                                "F_EnCode" : "SysManage",
                                "F_FullName" : "农机跟踪",
                                "F_Icon" : "fa fa fa-book",
                                "F_UrlAddress" : null,
                                "F_Target" : "expand",
                                "F_IsMenu" : 0,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 1,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : null,
                                "F_CreateDate" : null,
                                "F_CreateUserId" : null,
                                "F_CreateUserName" : null,
                                "F_ModifyDate" : "",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },
                            {
                                "F_ModuleId" : "7ae94059-9aa5-48eb-8330-4e2a6565b193",
                                "F_ParentId" : "3",
                                "F_EnCode" : "AreaManage",
                                "F_FullName" : "农机详情",
                                "F_Icon" : "fa fa-jsfiddle",
                                "F_UrlAddress" : "../pages/userSystem/groundDails.html",
                                "F_Target" : "iframe",
                                "F_IsMenu" : 1,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 1,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : "",
                                "F_CreateDate" : "",
                                "F_CreateUserId" : "System",
                                "F_CreateUserName" : "",
                                "F_ModifyDate" : "2016-04-29 14:05:33",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },
                            {
                                "F_ModuleId" : "7ae94059-9aa5-48eb-8330-4e2a6565b193",
                                "F_ParentId" : "3",
                                "F_EnCode" : "AreaManage",
                                "F_FullName" : "作业跟踪",
                                "F_Icon" : "fa fa-leaf",
                                "F_UrlAddress" : "../pages/mach/mach_map.html",
                                "F_Target" : "iframe",
                                "F_IsMenu" : 1,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 1,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : "",
                                "F_CreateDate" : "",
                                "F_CreateUserId" : "System",
                                "F_CreateUserName" : "",
                                "F_ModifyDate" : "2016-04-29 14:05:33",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },
                            {
                                "F_ModuleId" : "4",
                                "F_ParentId" : "0",
                                "F_EnCode" : "SysManage",
                                "F_FullName" : "数据分析",
                                "F_Icon" : "fa fa-cogs",
                                "F_UrlAddress" : null,
                                "F_Target" : "expand",
                                "F_IsMenu" : 0,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 1,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : null,
                                "F_CreateDate" : null,
                                "F_CreateUserId" : null,
                                "F_CreateUserName" : null,
                                "F_ModifyDate" : "",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },

                            {
                                "F_ModuleId" : "7ae94059-9aa5-48eb-8330-4e2a6565b193",
                                "F_ParentId" : "4",
                                "F_EnCode" : "AreaManage",
                                "F_FullName" : "数据统计",
                                "F_Icon" : "fa fa-bar-chart",
                                "F_UrlAddress" : "../pages/userSystem/OrgData.html",
                                "F_Target" : "iframe",
                                "F_IsMenu" : 1,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 1,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : "",
                                "F_CreateDate" : "",
                                "F_CreateUserId" : "System",
                                "F_CreateUserName" : "",
                                "F_ModifyDate" : "2016-04-29 14:05:33",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },

					{
						"F_ModuleId" : "1",
						"F_ParentId" : "0",
						"F_EnCode" : "SysManage",
						"F_FullName" : "组织机构",
						"F_Icon" : "fa fa-desktop",
						"F_UrlAddress" : null,
						"F_Target" : "expand",
						"F_IsMenu" : 0,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 1,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : null,
						"F_CreateUserId" : null,
						"F_CreateUserName" : null,
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},
					{
						"F_ModuleId" : "8",
						"F_ParentId" : "2",
						"F_EnCode" : "OrganizeManage",
						"F_FullName" : "业务人员",
						"F_Icon" : "fa fa-sitemap",
						"F_UrlAddress" : "../pages/userSystem/orgUser.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 1,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : null,
						"F_CreateUserId" : null,
						"F_CreateUserName" : null,
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},
					{
						"F_ModuleId" : "7ae94059-9aa5-48eb-8330-4e2a6565b193",
						"F_ParentId" : "1",
						"F_EnCode" : "AreaManage",
						"F_FullName" : "机构维护",
						"F_Icon" : "fa fa-leaf",
						"F_UrlAddress" : "../pages/userSystem/baseOrg.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 1,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : "",
						"F_CreateDate" : "",
						"F_CreateUserId" : "System",
						"F_CreateUserName" : "",
						"F_ModifyDate" : "2016-04-29 14:05:33",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},






					{
						"F_ModuleId" : "691f3810-a602-4523-8518-ce5856482d48",
						"F_ParentId" : "5",
						"F_EnCode" : "农机-终端",
						"F_FullName" : "农机-终端",
						"F_Icon" : "fa fa-file-text-o",
						"F_UrlAddress" : "../pages/userSystem/machTerminal.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 2,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : "2015-11-23 22:13:21",
						"F_CreateUserId" : "System",
						"F_CreateUserName" : "",
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "24a055d6-5924-44c5-be52-3715cdd68011",
						"F_ModifyUserName" : ""
					},
					{
						"F_ModuleId" : "9",
						"F_ParentId" : "2",
						"F_EnCode" : "DepartmentManage",
						"F_FullName" : "司机管理",
						"F_Icon" : "fa fa-th-list",
						"F_UrlAddress" : "../pages/userSystem/worker.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 2,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : null,
						"F_CreateUserId" : null,
						"F_CreateUserName" : null,
						"F_ModifyDate" : "2",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},
					{
						"F_ModuleId" : "2",
						"F_ParentId" : "0",
						"F_EnCode" : "BaseManage",
						"F_FullName" : "用户管理",
						"F_Icon" : "fa fa-coffee",
						"F_UrlAddress" : null,
						"F_Target" : "expand",
						"F_IsMenu" : 0,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 2,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : null,
						"F_CreateUserId" : null,
						"F_CreateUserName" : null,
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "0f36148c-719f-41e0-8c8c-16ffbc40d0e0",
						"F_ModifyUserName" : ""
					},

					{
						"F_ModuleId" : "5",
						"F_ParentId" : "0",
						"F_EnCode" : "FlowManage",
						"F_FullName" : "设备管理",
						"F_Icon" : "fa fa-share-alt",
						"F_UrlAddress" : null,
						"F_Target" : "expand",
						"F_IsMenu" : 0,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 3,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : null,
						"F_CreateUserId" : null,
						"F_CreateUserName" : null,
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},




					{
						"F_ModuleId" : "0d296398-bc0e-4f38-996a-6e24bc88cc53",
						"F_ParentId" : "5",
						"F_EnCode" : "农机管理",
						"F_FullName" : "农机管理",
						"F_Icon" : "fa fa-hourglass-half",
						"F_UrlAddress" : "../pages/userSystem/machine.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 4,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : "2015-11-23 22:13:39",
						"F_CreateUserId" : "System",
						"F_CreateUserName" : "",
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "24a055d6-5924-44c5-be52-3715cdd68011",
						"F_ModifyUserName" : ""
					},{
                                "F_ModuleId" : "0d296398-bc0e-4f38-996a-6e24bc88cc53",
                                "F_ParentId" : "5",
                                "F_EnCode" : "农机宽度",
                                "F_FullName" : "农机宽度",
                                "F_Icon" : "fa fa-edit",
                                "F_UrlAddress" : "../pages/userSystem/machineWidth.html",
                                "F_Target" : "iframe",
                                "F_IsMenu" : 1,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 4,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : null,
                                "F_CreateDate" : "2015-11-23 22:13:39",
                                "F_CreateUserId" : "System",
                                "F_CreateUserName" : "",
                                "F_ModifyDate" : "",
                                "F_ModifyUserId" : "24a055d6-5924-44c5-be52-3715cdd68011",
                                "F_ModifyUserName" : ""
                            },




					{
						"F_ModuleId" : "923f7d65-e307-45f7-8f96-73ecbf23b324",
						"F_ParentId" : "5",
						"F_EnCode" : "终端管理",
						"F_FullName" : "终端管理",
						"F_Icon" : "fa fa-flag",
						"F_UrlAddress" : "../pages/userSystem/terminal.html",
						"F_Target" : "iframe",
						"F_IsMenu" : 1,
						"F_AllowExpand" : 1,
						"F_IsPublic" : 0,
						"F_AllowEdit" : null,
						"F_AllowDelete" : null,
						"F_SortCode" : 5,
						"F_DeleteMark" : 0,
						"F_EnabledMark" : 1,
						"F_Description" : null,
						"F_CreateDate" : "",
						"F_CreateUserId" : "System",
						"F_CreateUserName" : "",
						"F_ModifyDate" : "",
						"F_ModifyUserId" : "System",
						"F_ModifyUserName" : ""
					},

                            {
                                "F_ModuleId" : "923f7d65-e307-45f7-8f96-73ecbf23b324",
                                "F_ParentId" : "5",
                                "F_EnCode" : "农机维护",
                                "F_FullName" : "农机维护",
                                "F_Icon" : "fa fa-cogs",
                                "F_UrlAddress" : "../pages/userSystem/machineMaintenance.html",
                                "F_Target" : "iframe",
                                "F_IsMenu" : 1,
                                "F_AllowExpand" : 1,
                                "F_IsPublic" : 0,
                                "F_AllowEdit" : null,
                                "F_AllowDelete" : null,
                                "F_SortCode" : 5,
                                "F_DeleteMark" : 0,
                                "F_EnabledMark" : 1,
                                "F_Description" : null,
                                "F_CreateDate" : "",
                                "F_CreateUserId" : "System",
                                "F_CreateUserName" : "",
                                "F_ModifyDate" : "",
                                "F_ModifyUserId" : "System",
                                "F_ModifyUserName" : ""
                            },




					];
			/*
			 * 
			 *           
			 *       左边导航栏的结构    
			 *           
			 *           
			                  <li>
	                	<a><i></i><span></span><i></i></a>
	
	                 				<ul>
	                 					<li>
	                 						<a><i></i></a>
	                 									<ul>
	                 										<li>
	                 											<a><i></i></a>
	                 										</li>
	                 									</ul>
	                 					</li>
	                 				</ul>
	                 </li> 
	                 
	                 *
	                 *
	                 */
	                
			            
			            
            var _html = "";
            $.each(data, function (i) {
                var row = data[i];
                if (row.F_ParentId == "0") {
                    if (i == 0) {
                        _html += '<li class="treeview active">';
                    } else {
                        _html += '<li class="treeview">';
                    }
                    _html += '<a href="#">'+ '<i class="' + row.F_Icon + '"></i><span>' + row.F_FullName + '</span><i class="fa fa-angle-left pull-right"></i>'+'</a>';
                   
                 
                    var childNodes = $.learunindex.jsonWhere(data, function (v) { return v.F_ParentId == row.F_ModuleId});
                    if (childNodes.length > 0) {
                        _html += '<ul class="treeview-menu">';
                        $.each(childNodes, function (i) {
                            var subrow = childNodes[i];
                            var subchildNodes = $.learunindex.jsonWhere(data, function (v) { return v.F_ParentId == subrow.F_ModuleId});
                            _html += '<li>';
                            if (subchildNodes.length > 0) {
                                _html += '<a href="#"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName + '';
                                _html += '<i class="fa fa-angle-left pull-right"></i></a>';
                                _html += '<ul class="treeview-menu">';
                                $.each(subchildNodes, function (i) {
                                    var subchildNodesrow = subchildNodes[i];
                                    
                             /* 页面路径   subrow.F_UrlAddress */  
                                    _html += '<li><a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subchildNodesrow.F_Icon + '"></i>' + subchildNodesrow.F_FullName + '</a></li>';
                                });
                                _html += '</ul>';

                            } else {
                            	   /* 页面路径   subrow.F_UrlAddress */
                                _html += '<a class="menuItem" data-id="' + subrow.F_ModuleId + '" href="' + subrow.F_UrlAddress + '"><i class="' + subrow.F_Icon + '"></i>' + subrow.F_FullName + '</a>';
                            }
                            _html += '</li>';
                        });
                        _html += '</ul>';
                    }
                    _html += '</li>';
                }
            });
            $("#sidebar-menu").append(_html);
            $("#sidebar-menu li a").click(function () {
                var d = $(this), e = d.next();
                if (e.is(".treeview-menu") && e.is(":visible")) {
                    e.slideUp(500, function () {
                        e.removeClass("menu-open");
                    }),
                    e.parent("li").removeClass("active");
                } else if (e.is(".treeview-menu") && !e.is(":visible")) {
                    var f = d.parents("ul").first(),
                    g = f.find("ul:visible").slideUp(500);
                    g.removeClass("menu-open");
                    var h = d.parent("li");
                    e.slideDown(500, function () {
                        e.addClass("menu-open"),
                        f.find("li.active").removeClass("active"),
                        h.addClass("active");
                       

                        var _height1 = $(window).height() - $("#sidebar-menu >li.active").position().top - 41;
                        var _height2 = $("#sidebar-menu li > ul.menu-open").height() + 10;
                        if (_height2 > _height1) {
                            $("#sidebar-menu >li > ul.menu-open").css({
                                overflow: "auto",
                                height: _height1
                                
                            });
                        }
                    });
                }
                e.is(".treeview-menu");
            });
        }
    };
    $(function () {
        $.learunindex.load();
        $.learunindex.loadMenu();
        $.learuntab.init();
    });
})(jQuery);