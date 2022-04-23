import sys

from lrcp.argument_parser import create_parser


def main():
    parser = create_parser()
    args = parser.parse_args(sys.argv[1:])
    try:
        args.func(args)
    except AttributeError:
        parser.parse_args([*sys.argv[1:], '--help'])


if __name__ == '__main__':
    main()
