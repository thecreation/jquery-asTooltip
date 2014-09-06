'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },

        // -- csscomb Config ---------------------------------------------------------
        csscomb: {
            options: {
                config: 'less/.csscomb.json'
            },
            src: {
                expand: true,
                cwd: 'css/',
                src: ['css/*.css', '!css/*.min.css'],
                dest: 'css/'
            }
        },

        // -- less Config ---------------------------------------------------------
        less: {
            skins: {
                files: {
                    'css/tooltip.dream.css': 'less/skin-dream.less',
                    'css/tooltip.pure.css': 'less/skin-pure.less',
                    'css/tooltip.sea.css': 'less/skin-sea.less'
                }
            },
            dist: {
                files: {
                    'css/tooltip.css': 'less/tooltip.less'
                }
            }
        },

        // -- autoprefixer Config ---------------------------------------------------------
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            },
            src: {
                src: ['css/*.css', 'css/!*.min.css'],
            }
        },

        // -- jshint Config ---------------------------------------------------------
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            }
        },

        // -- jsbeautifier Config ---------------------------------------------------------
        jsbeautifier: {
            files: ['Gruntfile.js', "src/**/*.js"],
            options: {
                "indent_size": 4,
                "indent_char": " ",
                "indent_level": 0,
                "indent_with_tabs": false,
                "preserve_newlines": true,
                "max_preserve_newlines": 10,
                "jslint_happy": false,
                "brace_style": "collapse",
                "keep_array_indentation": false,
                "keep_function_indentation": false,
                "space_before_conditional": true,
                "eval_code": false,
                "indent_case": false,
                "unescape_strings": false
            }
        },


        // -- uglify Config ---------------------------------------------------------
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },

        // -- watch Config ---------------------------------------------------------
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src']
            },
        },

        // -- replace Config ---------------------------------------------------------
        replace: {
            bower: {
                src: ['bower.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
            jquery: {
                src: ['tabs.jquery.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            },
        }
    });

    // Load npm plugins to provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    // Default task.
    grunt.registerTask('default', ['js', 'css', 'dist']);

    grunt.registerTask('js', ['jsbeautifier', 'jshint']);

    grunt.registerTask('css', ['less', 'autoprefixer', 'csscomb']);

    grunt.registerTask('dist', ['clean', 'concat', 'uglify']);

    grunt.registerTask('version', [
        'replace:bower',
        'replace:jquery'
    ]);
};
