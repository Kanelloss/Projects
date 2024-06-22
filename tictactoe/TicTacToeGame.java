package gr.aueb.cf.ch10.tictactoe;

import java.util.Scanner;

public class TicTacToeGame {

    public static void main(String[] args) {

        char[][] board = new char[3][3];
        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[row].length; col++) {
                board[row][col] = ' ';
            }
        }

        char player = 'X';
        boolean gameOver = false;

        Scanner scanner = new Scanner(System.in);

        while (!gameOver) {
            printBoard(board);
            System.out.println("Player " + player + " enter: ");
            int row = scanner.nextInt();
            while (true) {
                if (row > 2 || row < 0) {
                    System.out.println("Invalid Row. Try again!");
                    scanner.nextLine();
                    row = scanner.nextInt();
                } else {
                    break;
                }
            }
            int col = scanner.nextInt();
            while (true) {
                if (col > 2 || col < 0) {
                    System.out.println("Invalid Column. Try again!");
                    scanner.nextLine();
                    col = scanner.nextInt();
                } else {
                    break;
                }
            }

            if (board[row][col] == ' ') {
                board[row][col] = player;   // place the element
                gameOver = haveWon(board, player);
                if (gameOver) {
                    System.out.println("Player " + player + " has won: ");
                } else if (isBoardFull(board)) {
                    printBoard(board);
                    System.out.println("This game is a draw!");
                    gameOver = true;
                } else {
                    player = (player == 'X') ? 'O' : 'X';

//                    if(player == 'X') {
//                        player = '0';
//                    } else {
//                        player = 'X';
//                    }
                }
            }
            else {
                System.out.println("Invalid move. Try again!");
            }
        }
        printBoard(board);
    }


    public static void printBoard(char[][] board) {
        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[row].length; col++) {
                System.out.print(board[row][col] + " | ");
            }
            System.out.println();
        }
    }


    public static boolean haveWon(char[][] board, char player) {
        // check rows
        for (int row = 0; row < board.length; row++) {
            if (board[row][0] == player && board[row][1] == player && board[row][2] == player) {
                return true;
            }
        }

        // check columns
        for (int col = 0; col < board[0].length; col++) {
            if (board[0][col] == player && board[1][col] == player && board[2][col] == player) {
                return true;
            }
        }


        // check diagonally
        if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
            return true;
        }

        if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
            return true;
        }

            return false;       // If none of that is true, return false.
    }

    public static boolean isBoardFull(char[][] board) {
        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[row].length; col++) {
                if (board[row][col] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }

}