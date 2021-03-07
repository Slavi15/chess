let board = null;
let chess = new Chess();
import chessEcoCodes from 'https://cdn.skypack.dev/pin/chess-eco-codes@v0.0.0-SmTuNwaJJtW3pMk2tcVz/mode=imports,min/optimized/chess-eco-codes.js';
let $status = $('#status');
let $fen = $('#fen');
let $pgn = $('#pgn');
let $com = $('#com');

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
    let openingName = chessEcoCodes(chess.fen());
    if(openingName !== undefined) {
        $com.html(openingName.name);
    } else if(openingName == undefined) {
        return false;
    }
    //console.log(openingName)
};

function onChange(oldPos, newPos) {
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('New position: ' + Chessboard.objToFen(newPos))

    console.log(chess.history());
}

$('#prevBtn').on('click', () => {
    chess.undo();
    board.position(chess.fen());
    //console.log(chess.history());
});

$('#nextBtn').on('click', () => {
    chess.move(chess.history());
    board.position(chess.fen());
    //console.log(chess.history())
});

$('#resetBtn').on('click', () => {
    window.location.reload();
});

function updateStatus() {
    let status = '';

    let moveColor = 'White';
    if(chess.turn() == 'b') {
        moveColor = 'Black'
    }

    if(chess.in_checkmate()) {
        status = 'Checkmate! ' + moveColor + ' lost!';
        return chess.reset();
    } else if((chess.in_draw()) || (chess.in_stalemate()) || (chess.in_threefold_repetition()) || (chess.insufficient_material())) {
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

if(chess.fen() == 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    $com.html('Play first move!');
};

let config = {
    position: 'start',
    showNotation: true,
    draggable: true,
    dropOffBoard: 'snapback',
    onDragStart: onDragStart,
    onChange: onChange,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('board', config);

updateStatus();
