let board = null;
let chess = new Chess();
let $status = $('#status');
let $fen = $('#fen');
let $pgn = $('#pgn');

function onDragStart(source, piece, position, orientation) {
    if(chess.game_over()) {
        return false;
    };

    if((chess.turn() == 'w' && piece.search(/^b/) !== -1) || (chess.turn() == 'b' && piece.search(/^w/) !== -1)) {
        return false;
    };
};

function onDrop(source, target) {
    let move = chess.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if(move == null) {
        return 'snapback';
    };

    updateStatus();
};

function onSnapEnd () {
    board.position(chess.fen());
};

function updateStatus() {
    let status = '';

    let moveColor = 'White';
    if(chess.turn() == 'b') {
        moveColor = 'Black'
    }

    if(chess.in_checkmate()) {
        status = 'Game over! ' + moveColor + ' lost!'
    } else if(chess.in_draw()) {
        status = 'Draw!'
    } else {
        status = moveColor + ' to move!'

        if(chess.in_check()) {
            status = moveColor + ' is in check!'
        }
    }

    $status.html(status)
    $fen.html(chess.fen())
    $pgn.html(chess.pgn({ max_width: 10, newline_char: '<br>' }))
};

let config = {
    position: 'start',
    showNotation: true,
    draggable: true,
    dropOffBoard: 'snapback',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('board', config);

updateStatus();
