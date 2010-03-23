#  ApplicationBase
#
#  Some basic methods, including FileIO, logging, exception handling
module Helpers

    # log something bitches!
    def log(msg)
        puts msg.to_s
    end

    #handle exceptions the DRY way, or at least start to.
    def handle_exception(e)
        msg = e.message

        if e.message.to_s != e.exception.to_s
          msg = e.exception.to_s+" :: "+msg
        end

        self.log "\nERROR RESCUE\n\n #{msg}"
        self.log "\nBACKTRACE\n\n#{e.backtrace.join("\n")}\n\n"
    end

    #generic base method to show the current programs usage.
    def output_help(help_file)
        begin
            self.log(self.read_in_file(help_file))
        rescue SystemExit => e
            exit!(0)
        end
    end

    def continue?(to_log=nil, &block)
        self.log(to_log) if to_log && @options.verbose
        @highline.ask("press any key to continue:" ) if @options.inspection
        yield() if block_given?
    end

end